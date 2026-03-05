from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut
from app.services.review_service import delete_review, list_reviews_by_product, list_user_reviews, upsert_review


router = APIRouter()


@router.get('', response_model=list[ReviewOut])
def list_my_reviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[ReviewOut]:
    return list_user_reviews(db, current_user.id)


@router.get('/product/{product_id}', response_model=list[ReviewOut])
def list_product_reviews(product_id: int, db: Session = Depends(get_db)) -> list[ReviewOut]:
    return list_reviews_by_product(db, product_id)


@router.post('', response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_or_update_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewOut:
    return upsert_review(db, current_user.id, payload)


@router.delete('/product/{product_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_my_review(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    delete_review(db, current_user.id, product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
