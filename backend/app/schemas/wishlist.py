from pydantic import BaseModel


class WishlistAdd(BaseModel):
    product_id: int


class WishlistItemOut(BaseModel):
    product_id: int
    name: str
    price: float


class WishlistOut(BaseModel):
    items: list[WishlistItemOut]
