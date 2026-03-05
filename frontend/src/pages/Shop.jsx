import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useProducts } from '../hooks/useProducts'

export default function Shop() {
  const { products, loading } = useProducts()
  const [query, setQuery] = useState('')
  const [onlyInStock, setOnlyInStock] = useState(false)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products.filter((product) => {
      const hasImage = Boolean(product.image_url || product.image_urls?.length)
      if (!hasImage) return false
      const matchesQuery = !term || product.name.toLowerCase().includes(term) || (product.description || '').toLowerCase().includes(term)
      const matchesStock = !onlyInStock || product.stock > 0
      return matchesQuery && matchesStock
    })
  }, [products, query, onlyInStock])

  return (
    <div className="stack-lg">
      <SectionHeader title="Shop" subtitle="Premium tees built for daily wear" />

      <section className="shop-controls">
        <input className="input-field" placeholder="Search t-shirts" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button className={`btn-ghost ${onlyInStock ? 'active-filter' : ''}`} onClick={() => setOnlyInStock((v) => !v)}>
          {onlyInStock ? 'Showing In Stock' : 'Filter In Stock'}
        </button>
      </section>

      {loading ? <p>Loading catalog...</p> : (
        <section className="products-grid">
          {filtered.map((product, index) => <ProductCard key={product.id} product={product} delay={index * 0.02} />)}
        </section>
      )}
    </div>
  )
}
