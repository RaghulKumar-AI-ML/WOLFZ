from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryOut
from app.services.category_service import create_category, get_category, list_categories


router = APIRouter()


@router.get('', response_model=list[CategoryOut])
def list_all_categories(db: Session = Depends(get_db)) -> list[CategoryOut]:
    return list_categories(db)


@router.post('', response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_one_category(payload: CategoryCreate, db: Session = Depends(get_db)) -> CategoryOut:
    return create_category(db, payload)


@router.get('/{category_id}', response_model=CategoryOut)
def get_one_category(category_id: int, db: Session = Depends(get_db)) -> CategoryOut:
    return get_category(db, category_id)
