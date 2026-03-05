from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def register_user(db: Session, payload: UserCreate) -> User:
    existing = db.query(User).filter((User.email == payload.email) | (User.username == payload.username)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already exists')

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username_or_email: str, password: str) -> User | None:
    user = db.query(User).filter((User.email == username_or_email) | (User.username == username_or_email)).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
