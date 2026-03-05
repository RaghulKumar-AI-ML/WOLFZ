from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.misc import TimestampMixin


class Product(Base, TimestampMixin):
    __tablename__ = 'products'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(280), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default='')
    image_url: Mapped[str] = mapped_column(String(500), default='')
    image_urls: Mapped[str] = mapped_column(Text, default='[]')
    price: Mapped[float] = mapped_column(Float)
    compare_at_price: Mapped[float] = mapped_column(Float, default=0.0)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    category_id: Mapped[int | None] = mapped_column(ForeignKey('categories.id'), nullable=True)
