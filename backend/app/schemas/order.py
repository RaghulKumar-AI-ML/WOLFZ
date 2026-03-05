from pydantic import BaseModel


class OrderCreateFromCart(BaseModel):
    currency: str = 'INR'
    shipping_name: str
    shipping_phone: str
    shipping_address1: str
    shipping_address2: str = ''
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    shipping_country: str = 'India'


class OrderStatusUpdate(BaseModel):
    status: str


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float


class OrderOut(BaseModel):
    id: int
    status: str
    total_amount: float
    currency: str
    delivery_status: str
    shipping_name: str
    shipping_phone: str
    shipping_address1: str
    shipping_address2: str
    shipping_city: str
    shipping_state: str
    shipping_postal_code: str
    shipping_country: str
    items: list[OrderItemOut]
