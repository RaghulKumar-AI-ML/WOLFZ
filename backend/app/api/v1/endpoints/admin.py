from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_admin_user
from app.models.order import Order
from app.models.product import Product
from app.models.user import User


router = APIRouter()


@router.get('/stats')
def stats(db: Session = Depends(get_db), _: User = Depends(get_admin_user)) -> dict[str, int]:
    return {
        'users': db.query(User).count(),
        'orders': db.query(Order).count(),
        'products': db.query(Product).count(),
    }
