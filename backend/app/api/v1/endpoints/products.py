from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductOut
from app.services.product_service import create_product, get_product, list_products


router = APIRouter()


@router.post('', response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create(payload: ProductCreate, db: Session = Depends(get_db)) -> ProductOut:
    return create_product(db, payload)


@router.get('', response_model=list[ProductOut])
def list_all(response: Response, db: Session = Depends(get_db)) -> list[ProductOut]:
    response.headers['Cache-Control'] = f'public, max-age={settings.PRODUCTS_CACHE_MAX_AGE_SECONDS}'
    return list_products(db)


@router.get('/{product_id}', response_model=ProductOut)
def get_one(product_id: int, db: Session = Depends(get_db)) -> ProductOut:
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')
    return product
