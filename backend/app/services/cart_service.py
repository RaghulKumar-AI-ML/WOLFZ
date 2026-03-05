from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemOut, CartOut


def upsert_cart_item(db: Session, user_id: int, product_id: int, quantity: int) -> CartItem:
    if quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Quantity must be greater than zero')

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')

    if product.stock < quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Requested quantity exceeds stock')

    item = db.query(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id).first()
    if item:
        item.quantity = quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


def remove_cart_item(db: Session, user_id: int, product_id: int) -> None:
    item = db.query(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id).first()
    if item:
        db.delete(item)
        db.commit()


def clear_cart(db: Session, user_id: int) -> None:
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()


def get_cart_items(db: Session, user_id: int) -> list[CartItem]:
    return db.query(CartItem).filter(CartItem.user_id == user_id).all()


def build_cart_out(db: Session, user_id: int) -> CartOut:
    items = get_cart_items(db, user_id)
    if not items:
        return CartOut(items=[], total=0.0)

    product_ids = [item.product_id for item in items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    out_items: list[CartItemOut] = []
    total = 0.0
    for item in items:
        product = product_map.get(item.product_id)
        if not product:
            continue

        line_total = float(product.price) * item.quantity
        total += line_total
        out_items.append(
            CartItemOut(
                product_id=product.id,
                name=product.name,
                unit_price=float(product.price),
                quantity=item.quantity,
                line_total=line_total,
            )
        )

    return CartOut(items=out_items, total=total)
