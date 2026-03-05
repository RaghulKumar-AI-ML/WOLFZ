from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.misc import TimestampMixin


class UserGamification(Base, TimestampMixin):
    __tablename__ = 'user_gamification'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True)
    wolf_points: Mapped[int] = mapped_column(Integer, default=0)
    rank: Mapped[str] = mapped_column(String(40), default='Pup')
