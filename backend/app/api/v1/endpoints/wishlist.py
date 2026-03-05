from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.wishlist import WishlistAdd, WishlistOut
from app.services.wishlist_service import add_to_wishlist, build_wishlist_out, remove_from_wishlist


router = APIRouter()


@router.get('', response_model=WishlistOut)
def list_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> WishlistOut:
    return build_wishlist_out(db, current_user.id)


@router.post('', response_model=WishlistOut)
def add_wishlist_item(
    payload: WishlistAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WishlistOut:
    try:
        add_to_wishlist(db, current_user.id, payload.product_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return build_wishlist_out(db, current_user.id)


@router.delete('/{product_id}', response_model=WishlistOut)
def remove_wishlist_item(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WishlistOut:
    remove_from_wishlist(db, current_user.id, product_id)
    return build_wishlist_out(db, current_user.id)


@router.delete('', status_code=status.HTTP_204_NO_CONTENT)
def clear_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Response:
    items = build_wishlist_out(db, current_user.id).items
    for item in items:
        remove_from_wishlist(db, current_user.id, item.product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
