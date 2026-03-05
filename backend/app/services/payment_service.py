from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.user import User
from app.services.email_service import send_email
from app.services.notification_service import push_notification
from app.services.order_service import get_user_order, update_delivery_status, update_order_status


def create_intent(db: Session, user_id: int, order_id: int) -> dict[str, str | float | int]:
    order = get_user_order(db, user_id, order_id)
    if order.status != 'pending':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Order is not pending payment')

    return {
        'status': 'pending',
        'payment_intent_id': f"pi_{order.id}_{uuid4().hex[:12]}",
        'order_id': order.id,
        'amount': float(order.total_amount),
        'currency': order.currency,
    }


def confirm_payment(
    db: Session,
    user_id: int,
    order_id: int,
    payment_intent_id: str,
) -> dict[str, str | float | int]:
    _ = payment_intent_id
    order = get_user_order(db, user_id, order_id)
    if order.status == 'paid':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Order is already paid')

    updated_order = update_order_status(db, order, 'paid')
    updated_order = update_delivery_status(db, updated_order, 'packed')

    user = db.query(User).filter(User.id == user_id).first()
    if user:
        send_email(
            to=user.email,
            subject='Payment received',
            body=f'Your payment for order #{updated_order.id} was successful.',
        )
        push_notification(user_id=user.id, message=f'Order #{updated_order.id} payment confirmed.')

    return {
        'status': 'succeeded',
        'order_id': updated_order.id,
        'amount': float(updated_order.total_amount),
        'currency': updated_order.currency,
    }


def get_order_for_payment(db: Session, user_id: int, order_id: int) -> Order:
    return get_user_order(db, user_id, order_id)
