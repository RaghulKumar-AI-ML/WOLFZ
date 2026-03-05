from pydantic import BaseModel


class PaymentIntentCreate(BaseModel):
    order_id: int


class PaymentIntentConfirm(BaseModel):
    order_id: int
    payment_intent_id: str


class PaymentIntentOut(BaseModel):
    status: str
    payment_intent_id: str
    order_id: int
    amount: float
    currency: str


class PaymentConfirmationOut(BaseModel):
    status: str
    order_id: int
    amount: float
    currency: str
