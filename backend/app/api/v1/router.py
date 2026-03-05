from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    auth,
    cart,
    categories,
    gamification,
    misc,
    orders,
    payments,
    products,
    reviews,
    users,
    wishlist,
)


api_router = APIRouter()
api_router.include_router(auth.router, prefix='/auth', tags=['auth'])
api_router.include_router(users.router, prefix='/users', tags=['users'])
api_router.include_router(products.router, prefix='/products', tags=['products'])
api_router.include_router(categories.router, prefix='/categories', tags=['categories'])
api_router.include_router(cart.router, prefix='/cart', tags=['cart'])
api_router.include_router(orders.router, prefix='/orders', tags=['orders'])
api_router.include_router(payments.router, prefix='/payments', tags=['payments'])
api_router.include_router(wishlist.router, prefix='/wishlist', tags=['wishlist'])
api_router.include_router(reviews.router, prefix='/reviews', tags=['reviews'])
api_router.include_router(gamification.router, prefix='/gamification', tags=['gamification'])
api_router.include_router(admin.router, prefix='/admin', tags=['admin'])
api_router.include_router(misc.router, prefix='/misc', tags=['misc'])
