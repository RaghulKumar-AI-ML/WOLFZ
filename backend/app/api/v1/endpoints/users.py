from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_admin_user, get_current_user
from app.models.user import User
from app.schemas.user import UserAdminUpdate, UserOut, UserPasswordUpdate, UserUpdate
from app.services.user_service import (
    change_current_user_password,
    delete_user_by_id,
    get_user_by_id,
    list_users,
    update_current_user_profile,
    update_user_by_admin,
)


router = APIRouter()


@router.get('/me', response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return current_user


@router.patch('/me', response_model=UserOut)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserOut:
    return update_current_user_profile(db, current_user, payload)


@router.patch('/me/password', status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: UserPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    change_current_user_password(db, current_user, payload)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('', response_model=list[UserOut])
def list_all_users(db: Session = Depends(get_db), _: User = Depends(get_admin_user)) -> list[UserOut]:
    return list_users(db)


@router.get('/{user_id}', response_model=UserOut)
def get_one_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)) -> UserOut:
    return get_user_by_id(db, user_id)


@router.patch('/{user_id}', response_model=UserOut)
def update_one_user(
    user_id: int,
    payload: UserAdminUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
) -> UserOut:
    return update_user_by_admin(db, user_id, payload)


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_one_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_admin_user)) -> Response:
    delete_user_by_id(db, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
