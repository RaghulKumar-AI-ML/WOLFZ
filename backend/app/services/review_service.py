from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.review import Review
from app.schemas.review import ReviewCreate


def list_reviews_by_product(db: Session, product_id: int) -> list[Review]:
    return db.query(Review).filter(Review.product_id == product_id).order_by(Review.id.desc()).all()


def list_user_reviews(db: Session, user_id: int) -> list[Review]:
    return db.query(Review).filter(Review.user_id == user_id).order_by(Review.id.desc()).all()


def upsert_review(db: Session, user_id: int, payload: ReviewCreate) -> Review:
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')

    review = db.query(Review).filter(
        Review.user_id == user_id,
        Review.product_id == payload.product_id,
    ).first()

    if not review:
        review = Review(user_id=user_id, **payload.model_dump())
        db.add(review)
    else:
        review.title = payload.title
        review.comment = payload.comment
        review.rating = payload.rating

    db.commit()
    db.refresh(review)
    return review


def delete_review(db: Session, user_id: int, product_id: int) -> None:
    review = db.query(Review).filter(Review.user_id == user_id, Review.product_id == product_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Review not found')
    db.delete(review)
    db.commit()
