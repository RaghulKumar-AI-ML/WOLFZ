import api from './api'

export const checkoutFromCart = async (payload) => (await api.post('/orders/checkout', payload)).data
export const listOrders = async () => (await api.get('/orders')).data
export const getOrder = async (id) => (await api.get(`/orders/${id}`)).data
