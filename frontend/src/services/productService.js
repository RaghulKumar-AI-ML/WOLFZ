import api from './api'

const normalizeProduct = (product) => {
  if (!product) return product
  let imageUrls = product.image_urls
  if (typeof imageUrls === 'string') {
    try {
      imageUrls = JSON.parse(imageUrls)
    } catch {
      imageUrls = imageUrls ? [imageUrls] : []
    }
  }
  return {
    ...product,
    image_urls: Array.isArray(imageUrls) ? imageUrls : [],
  }
}

export const fetchProducts = async () => {
  const data = (await api.get('/products')).data
  return Array.isArray(data) ? data.map(normalizeProduct) : []
}

export const fetchProduct = async (id) => normalizeProduct((await api.get(`/products/${id}`)).data)
