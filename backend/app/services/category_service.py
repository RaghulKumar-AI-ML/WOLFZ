from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate


def list_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name.asc()).all()


def get_category(db: Session, category_id: int) -> Category:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Category not found')
    return category


def create_category(db: Session, payload: CategoryCreate) -> Category:
    existing = db.query(Category).filter((Category.slug == payload.slug) | (Category.name == payload.name)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Category already exists')

    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
