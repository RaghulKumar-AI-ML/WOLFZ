from pydantic import BaseModel


class CouponOut(BaseModel):
    code: str
    discount_percent: float
