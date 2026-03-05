import api from './api'

export const getProductReviews = async (productId) => (await api.get(`/reviews/product/${productId}`)).data
export const upsertReview = async ({ product_id, rating, title, comment }) => {
  const response = await api.post('/reviews', { product_id, rating, title, comment })
  return response.data
}
