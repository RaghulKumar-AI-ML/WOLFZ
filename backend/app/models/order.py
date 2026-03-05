from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.misc import TimestampMixin


class Order(Base, TimestampMixin):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    status: Mapped[str] = mapped_column(String(40), default='pending')
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(8), default='INR')
    shipping_name: Mapped[str] = mapped_column(String(120), default='')
    shipping_phone: Mapped[str] = mapped_column(String(40), default='')
    shipping_address1: Mapped[str] = mapped_column(String(255), default='')
    shipping_address2: Mapped[str] = mapped_column(String(255), default='')
    shipping_city: Mapped[str] = mapped_column(String(120), default='')
    shipping_state: Mapped[str] = mapped_column(String(120), default='')
    shipping_postal_code: Mapped[str] = mapped_column(String(40), default='')
    shipping_country: Mapped[str] = mapped_column(String(120), default='')
    delivery_status: Mapped[str] = mapped_column(String(40), default='processing')


class OrderItem(Base, TimestampMixin):
    __tablename__ = 'order_items'

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey('orders.id'), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'))
    product_name: Mapped[str] = mapped_column(String(255), default='')
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0)
