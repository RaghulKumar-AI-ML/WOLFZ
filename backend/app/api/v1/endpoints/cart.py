from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.cart import CartAddItem, CartOut, CartUpdateItem
from app.services.cart_service import build_cart_out, clear_cart, remove_cart_item, upsert_cart_item


router = APIRouter()


@router.get('', response_model=CartOut)
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> CartOut:
    return build_cart_out(db, current_user.id)


@router.post('/items', response_model=CartOut)
def add_item(
    payload: CartAddItem,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CartOut:
    upsert_cart_item(db, current_user.id, payload.product_id, payload.quantity)
    return build_cart_out(db, current_user.id)


@router.patch('/items/{product_id}', response_model=CartOut)
def update_item(
    product_id: int,
    payload: CartUpdateItem,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CartOut:
    upsert_cart_item(db, current_user.id, product_id, payload.quantity)
    return build_cart_out(db, current_user.id)


@router.delete('/items/{product_id}', response_model=CartOut)
def delete_item(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CartOut:
    remove_cart_item(db, current_user.id, product_id)
    return build_cart_out(db, current_user.id)


@router.delete('', status_code=status.HTTP_204_NO_CONTENT)
def empty_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Response:
    clear_cart(db, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
