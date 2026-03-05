import { create } from 'zustand'
import * as productService from '../services/productService'

const PRODUCTS_TTL_MS = 60_000

export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  productsLoadedAt: 0,
  inFlightProductsRequest: null,

  loadProducts: async ({ force = false } = {}) => {
    const state = get()
    const age = Date.now() - state.productsLoadedAt
    if (!force && state.products.length > 0 && age < PRODUCTS_TTL_MS) {
      return state.products
    }
    if (state.inFlightProductsRequest) {
      return state.inFlightProductsRequest
    }

    const request = (async () => {
      set({ loading: true, error: null })
      try {
        const products = await productService.fetchProducts()
        set({
          products,
          loading: false,
          productsLoadedAt: Date.now(),
          inFlightProductsRequest: null,
        })
        return products
      } catch (error) {
        set({
          loading: false,
          error: error?.message || 'Failed to load products',
          inFlightProductsRequest: null,
        })
        return []
      }
    })()

    set({ inFlightProductsRequest: request })
    try {
      return await request
    } finally {
      if (get().inFlightProductsRequest === request) {
        set({ inFlightProductsRequest: null })
      }
    }
  },

  loadProduct: async (id) => {
    set({ loading: true, error: null, selectedProduct: null })
    try {
      set({ selectedProduct: await productService.fetchProduct(id), loading: false })
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.detail || 'Product not found' })
    }
  },
}))
