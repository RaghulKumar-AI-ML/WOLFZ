from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.misc import TimestampMixin


class CartItem(Base, TimestampMixin):
    __tablename__ = 'cart_items'
    __table_args__ = (UniqueConstraint('user_id', 'product_id', name='uq_cart_user_product'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
