from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreateFromCart
from app.utils.constants import DEFAULT_CURRENCY


def can_transition(current: str, target: str) -> bool:
    valid = {
        'pending': {'paid', 'cancelled'},
        'paid': {'shipped', 'cancelled'},
        'shipped': {'delivered'},
        'delivered': set(),
        'cancelled': set(),
    }
    return target in valid.get(current, set())


def list_user_orders(db: Session, user_id: int) -> list[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.id.desc()).all()


def get_user_order(db: Session, user_id: int, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Order not found')
    return order


def get_order_items(db: Session, order_id: int) -> list[OrderItem]:
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


def create_order_from_cart(db: Session, user_id: int, payload: OrderCreateFromCart) -> Order:
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Cart is empty')

    product_ids = [item.product_id for item in cart_items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    total_amount = 0.0
    for cart_item in cart_items:
        product = product_map.get(cart_item.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product in cart was not found')
        if product.stock < cart_item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Insufficient stock for product {product.name}',
            )
        total_amount += float(product.price) * cart_item.quantity

    currency = payload.currency or DEFAULT_CURRENCY
    order = Order(
        user_id=user_id,
        status='pending',
        total_amount=total_amount,
        currency=currency,
        shipping_name=payload.shipping_name,
        shipping_phone=payload.shipping_phone,
        shipping_address1=payload.shipping_address1,
        shipping_address2=payload.shipping_address2,
        shipping_city=payload.shipping_city,
        shipping_state=payload.shipping_state,
        shipping_postal_code=payload.shipping_postal_code,
        shipping_country=payload.shipping_country,
        delivery_status='processing',
    )
    db.add(order)
    db.flush()

    for cart_item in cart_items:
        product = product_map[cart_item.product_id]
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                quantity=cart_item.quantity,
                unit_price=float(product.price),
            )
        )
        product.stock -= cart_item.quantity

    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
    db.refresh(order)
    return order


def update_order_status(db: Session, order: Order, target_status: str) -> Order:
    if not can_transition(order.status, target_status):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Cannot transition order from {order.status} to {target_status}',
        )

    if target_status == 'cancelled':
        items = get_order_items(db, order.id)
        product_ids = [item.product_id for item in items]
        products = db.query(Product).filter(Product.id.in_(product_ids)).all()
        product_map = {product.id: product for product in products}
        for item in items:
            product = product_map.get(item.product_id)
            if product:
                product.stock += item.quantity

    order.status = target_status
    if target_status == 'shipped':
        order.delivery_status = 'in_transit'
    if target_status == 'delivered':
        order.delivery_status = 'delivered'

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def update_delivery_status(db: Session, order: Order, delivery_status: str) -> Order:
    order.delivery_status = delivery_status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def cancel_user_order(db: Session, user_id: int, order_id: int) -> Order:
    order = get_user_order(db, user_id, order_id)
    return update_order_status(db, order, 'cancelled')
