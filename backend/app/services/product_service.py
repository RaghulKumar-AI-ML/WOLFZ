import json

from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


def create_product(db: Session, payload: ProductCreate) -> Product:
    data = payload.model_dump()
    image_urls = data.get('image_urls')
    if image_urls is not None:
        data['image_urls'] = json.dumps(image_urls)
        if not data.get('image_url') and image_urls:
            data['image_url'] = image_urls[0]
    product = Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def list_products(db: Session) -> list[Product]:
    return (
        db.query(Product)
        .filter(Product.image_url.isnot(None), Product.image_url != '')
        .order_by(Product.id.desc())
        .all()
    )


def get_product(db: Session, product_id: int) -> Product | None:
    return db.query(Product).filter(Product.id == product_id).first()
