from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.misc import TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = 'reviews'
    __table_args__ = (UniqueConstraint('user_id', 'product_id', name='uq_review_user_product'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), index=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(Text, default='')
    title: Mapped[str] = mapped_column(String(120), default='')
