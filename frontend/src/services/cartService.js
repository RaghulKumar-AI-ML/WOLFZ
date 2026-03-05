import api from './api'

export const fetchCart = async () => (await api.get('/cart')).data
export const addCartItem = async (productId, quantity = 1) => (await api.post('/cart/items', { product_id: productId, quantity })).data
export const updateCartItem = async (productId, quantity) => (await api.patch(`/cart/items/${productId}`, { quantity })).data
export const removeCartItem = async (productId) => (await api.delete(`/cart/items/${productId}`)).data
export const clearCart = async () => { await api.delete('/cart') }
