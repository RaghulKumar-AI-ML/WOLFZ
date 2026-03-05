import api from './api'

export const getWishlist = async () => (await api.get('/wishlist')).data
export const addWishlistItem = async (productId) => (await api.post('/wishlist', { product_id: productId })).data
export const removeWishlistItem = async (productId) => (await api.delete(`/wishlist/${productId}`)).data
