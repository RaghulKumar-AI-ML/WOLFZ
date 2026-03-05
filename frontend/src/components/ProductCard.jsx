import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { currency } from '../utils/helpers'

export default function ProductCard({ product, delay = 0 }) {
  const rawImage = product.image_url || product.image_urls?.[0]
  const image = rawImage ? encodeURI(rawImage) : ''
  const compareAt = product.compare_at_price
  const hasOffer = Boolean(compareAt && compareAt > product.price)

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <Link to={`/products/${product.id}`}>
        <div className="product-media">
          {image ? <img src={image} alt={product.name} loading="lazy" decoding="async" /> : <div className="media-fallback" />}
        </div>
        <div className="product-copy">
          <p className="meta">{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</p>
          <h3>{product.name}</h3>
          <p className="desc">{product.description || 'Premium cut for daily statement wear.'}</p>
          <div className="price-line">
            <strong>{currency(product.price)}</strong>
            {hasOffer ? <span className="compare">{currency(compareAt)}</span> : null}
            {hasOffer ? <span className="offer-tag">Offer</span> : null}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
