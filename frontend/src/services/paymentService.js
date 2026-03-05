import api from './api'

export const createPaymentIntent = async (orderId) => (await api.post('/payments/intent', { order_id: orderId })).data
export const confirmPayment = async (orderId, paymentIntentId) => (await api.post('/payments/confirm', { order_id: orderId, payment_intent_id: paymentIntentId })).data
