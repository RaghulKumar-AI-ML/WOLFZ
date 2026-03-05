from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.schemas.wishlist import WishlistItemOut, WishlistOut


def add_to_wishlist(db: Session, user_id: int, product_id: int) -> None:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError('Product not found')

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == user_id,
        WishlistItem.product_id == product_id,
    ).first()
    if existing:
        return

    db.add(WishlistItem(user_id=user_id, product_id=product_id))
    db.commit()


def remove_from_wishlist(db: Session, user_id: int, product_id: int) -> None:
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == user_id,
        WishlistItem.product_id == product_id,
    ).first()
    if item:
        db.delete(item)
        db.commit()


def build_wishlist_out(db: Session, user_id: int) -> WishlistOut:
    wishlist_items = db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
    if not wishlist_items:
        return WishlistOut(items=[])

    product_ids = [item.product_id for item in wishlist_items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    items: list[WishlistItemOut] = []
    for wishlist_item in wishlist_items:
        product = product_map.get(wishlist_item.product_id)
        if not product:
            continue
        items.append(
            WishlistItemOut(
                product_id=product.id,
                name=product.name,
                price=float(product.price),
            )
        )
    return WishlistOut(items=items)
