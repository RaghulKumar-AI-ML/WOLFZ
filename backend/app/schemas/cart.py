from pydantic import BaseModel


class CartAddItem(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdateItem(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    product_id: int
    name: str
    unit_price: float
    quantity: int
    line_total: float


class CartOut(BaseModel):
    items: list[CartItemOut]
    total: float
