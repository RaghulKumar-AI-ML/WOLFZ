import { create } from 'zustand'
import * as cartService from '../services/cartService'

export const useCartStore = create((set, get) => ({
  cart: { items: [], total: 0 },
  loading: false,
  error: null,

  refresh: async () => {
    set({ loading: true, error: null })
    try {
      const cart = await cartService.fetchCart()
      set({ cart, loading: false })
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.detail || 'Unable to load cart' })
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ loading: true, error: null })
    try {
      const cart = await cartService.addCartItem(productId, quantity)
      set({ cart, loading: false })
    } catch (error) {
      set({ loading: false, error: error?.response?.data?.detail || 'Unable to add item' })
      throw error
    }
  },

  updateItem: async (productId, quantity) => set({ cart: await cartService.updateCartItem(productId, quantity) }),
  removeItem: async (productId) => set({ cart: await cartService.removeCartItem(productId) }),
  clear: async () => { await cartService.clearCart(); set({ cart: { items: [], total: 0 } }) },
  count: () => get().cart.items.reduce((sum, item) => sum + item.quantity, 0),
}))
