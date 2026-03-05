from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.payment import (
    PaymentConfirmationOut,
    PaymentIntentConfirm,
    PaymentIntentCreate,
    PaymentIntentOut,
)
from app.services.payment_service import confirm_payment, create_intent


router = APIRouter()


@router.post('/intent', response_model=PaymentIntentOut)
def create_payment_intent(
    payload: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaymentIntentOut:
    intent = create_intent(db, current_user.id, payload.order_id)
    return PaymentIntentOut(**intent)


@router.post('/confirm', response_model=PaymentConfirmationOut)
def confirm_payment_intent(
    payload: PaymentIntentConfirm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PaymentConfirmationOut:
    result = confirm_payment(db, current_user.id, payload.order_id, payload.payment_intent_id)
    return PaymentConfirmationOut(**result)
