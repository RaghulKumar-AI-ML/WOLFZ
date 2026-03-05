from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token
from app.schemas.user import LoginResponse, UserCreate, UserOut
from app.services.auth_service import authenticate_user, register_user


router = APIRouter()


@router.post('/register', response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserOut:
    return register_user(db, payload)


@router.post('/login', response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> LoginResponse:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    return LoginResponse(access_token=access_token, refresh_token=refresh_token)
