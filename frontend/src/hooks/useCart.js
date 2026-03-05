import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export const useCart = () => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.token))
  const cart = useCartStore()
  useEffect(() => { if (isAuthenticated) cart.refresh() }, [isAuthenticated])
  return cart
}
