import { useEffect } from 'react'
import { useProductStore } from '../store/productStore'

export const useProducts = () => {
  const products = useProductStore((state) => state.products)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const loadProducts = useProductStore((state) => state.loadProducts)

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return { products, loading, error, loadProducts }
}
