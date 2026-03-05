from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderCreateFromCart, OrderItemOut, OrderOut
from app.services.order_service import (
    cancel_user_order,
    create_order_from_cart,
    get_order_items,
    get_user_order,
    list_user_orders,
)


router = APIRouter()


def _to_order_out(db: Session, order: Order) -> OrderOut:
    items = get_order_items(db, order.id)
    return OrderOut(
        id=order.id,
        status=order.status,
        total_amount=float(order.total_amount),
        currency=order.currency,
        delivery_status=order.delivery_status,
        shipping_name=order.shipping_name,
        shipping_phone=order.shipping_phone,
        shipping_address1=order.shipping_address1,
        shipping_address2=order.shipping_address2,
        shipping_city=order.shipping_city,
        shipping_state=order.shipping_state,
        shipping_postal_code=order.shipping_postal_code,
        shipping_country=order.shipping_country,
        items=[
            OrderItemOut(
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=float(item.unit_price),
            )
            for item in items
        ],
    )


@router.get('', response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[OrderOut]:
    orders = list_user_orders(db, current_user.id)
    return [_to_order_out(db, order) for order in orders]


@router.post('/checkout', response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: OrderCreateFromCart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OrderOut:
    order = create_order_from_cart(db, current_user.id, payload)
    return _to_order_out(db, order)


@router.get('/{order_id}', response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> OrderOut:
    order = get_user_order(db, current_user.id, order_id)
    return _to_order_out(db, order)


@router.post('/{order_id}/cancel', response_model=OrderOut)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OrderOut:
    order = cancel_user_order(db, current_user.id, order_id)
    return _to_order_out(db, order)
