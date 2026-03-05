from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserAdminUpdate, UserPasswordUpdate, UserUpdate


def is_admin(user: User) -> bool:
    return user.is_admin


def list_users(db: Session) -> list[User]:
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return user


def _ensure_unique_identity(
    db: Session,
    *,
    email: str | None = None,
    username: str | None = None,
    exclude_user_id: int | None = None,
) -> None:
    if email:
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email and existing_email.id != exclude_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already in use')

    if username:
        existing_username = db.query(User).filter(User.username == username).first()
        if existing_username and existing_username.id != exclude_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already in use')


def update_current_user_profile(db: Session, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    if not data:
        return user

    _ensure_unique_identity(
        db,
        email=data.get('email'),
        username=data.get('username'),
        exclude_user_id=user.id,
    )

    for field, value in data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def change_current_user_password(db: Session, user: User, payload: UserPasswordUpdate) -> None:
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Current password is incorrect')

    user.hashed_password = get_password_hash(payload.new_password)
    db.add(user)
    db.commit()


def update_user_by_admin(db: Session, user_id: int, payload: UserAdminUpdate) -> User:
    user = get_user_by_id(db, user_id)
    data = payload.model_dump(exclude_unset=True)
    if not data:
        return user

    _ensure_unique_identity(
        db,
        email=data.get('email'),
        username=data.get('username'),
        exclude_user_id=user.id,
    )

    for field, value in data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user_by_id(db: Session, user_id: int) -> None:
    user = get_user_by_id(db, user_id)
    db.delete(user)
    db.commit()
