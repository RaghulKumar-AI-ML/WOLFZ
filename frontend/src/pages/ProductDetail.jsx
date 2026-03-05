import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useProductStore } from '../store/productStore'
import { addWishlistItem, getWishlist, removeWishlistItem } from '../services/wishlistService'
import { getProductReviews, upsertReview } from '../services/reviewService'
import { currency } from '../utils/helpers'

const ProductImage3D = lazy(() => import('../components/ProductImage3D'))

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const authToken = useAuthStore((state) => state.token)
  const { selectedProduct, loading, error, loadProduct } = useProductStore()
  const addItem = useCartStore((state) => state.addItem)

  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })
  const [activeImage, setActiveImage] = useState('')

  const isWishlisted = useMemo(
    () => selectedProduct && wishlist.some((item) => item.product_id === selectedProduct.id),
    [wishlist, selectedProduct]
  )

  const gallery = useMemo(() => {
    if (!selectedProduct) return []
    const list = selectedProduct.image_urls?.length ? selectedProduct.image_urls : [selectedProduct.image_url].filter(Boolean)
    return list.map((item) => encodeURI(item))
  }, [selectedProduct])

  useEffect(() => {
    loadProduct(id)
    getProductReviews(id).then(setReviews).catch(() => setReviews([]))
  }, [id])

  useEffect(() => {
    if (!authToken) return
    getWishlist().then((value) => setWishlist(value.items || [])).catch(() => setWishlist([]))
  }, [authToken])

  useEffect(() => {
    setActiveImage(gallery[0] || '')
  }, [gallery])

  const guardedAction = (callback) => {
    if (!authToken) return navigate('/auth')
    return callback()
  }

  const handleAddToCart = () => guardedAction(async () => {
    try {
      await addItem(selectedProduct.id, quantity)
      setMessage('Added to cart.')
    } catch (actionError) {
      setMessage(actionError?.response?.data?.detail || 'Unable to add item.')
    }
  })

  const toggleWishlist = () => guardedAction(async () => {
    try {
      if (isWishlisted) {
        const payload = await removeWishlistItem(selectedProduct.id)
        setWishlist(payload.items || [])
        setMessage('Removed from wishlist.')
      } else {
        const payload = await addWishlistItem(selectedProduct.id)
        setWishlist(payload.items || [])
        setMessage('Added to wishlist.')
      }
    } catch (actionError) {
      setMessage(actionError?.response?.data?.detail || 'Wishlist action failed.')
    }
  })

  const submitReview = (event) => {
    event.preventDefault()
    guardedAction(async () => {
      try {
        await upsertReview({
          product_id: selectedProduct.id,
          rating: Number(reviewForm.rating),
          title: reviewForm.title,
          comment: reviewForm.comment,
        })
        const fresh = await getProductReviews(selectedProduct.id)
        setReviews(fresh)
        setReviewForm({ rating: 5, title: '', comment: '' })
        setMessage('Review submitted.')
      } catch (reviewError) {
        setMessage(reviewError?.response?.data?.detail || 'Unable to submit review.')
      }
    })
  }

  if (loading) return <p>Loading product...</p>
  if (error || !selectedProduct) return <p>{error || 'Product not found.'}</p>

  const compareAt = selectedProduct.compare_at_price
  const hasOffer = Boolean(compareAt && compareAt > selectedProduct.price)

  return (
    <div className="stack-xl">
      <section className="detail-layout">
        <div className="detail-media">
          <Suspense fallback={<div className="product-3d-shell empty-3d">Loading 3D preview...</div>}>
            <ProductImage3D imageUrl={activeImage} />
          </Suspense>
          {gallery.length > 1 ? (
            <div className="product-gallery">
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  className={`gallery-thumb ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="Alternate view" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <article className="panel">
          <p className="eyebrow">Premium Drop</p>
          <h1>{selectedProduct.name}</h1>
          <p>{selectedProduct.description || 'Engineered for comfort and dominance.'}</p>
          <div className="row-between">
            <div className="price-line">
              <strong className="price-tag">{currency(selectedProduct.price)}</strong>
              {hasOffer ? <span className="compare">{currency(compareAt)}</span> : null}
              {hasOffer ? <span className="offer-tag">Limited Offer</span> : null}
            </div>
            <span className="meta">Stock: {selectedProduct.stock}</span>
          </div>

          <div className="row-gap">
            <input
              className="input-field qty"
              min={1}
              max={selectedProduct.stock || 1}
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            />
            <button className="btn-primary" type="button" onClick={handleAddToCart}>Add To Cart</button>
            <button className="btn-ghost" type="button" onClick={toggleWishlist}>
              {isWishlisted ? 'Remove Wishlist' : 'Add Wishlist'}
            </button>
          </div>

          {message ? <p className="status-line">{message}</p> : null}
        </article>
      </section>

      <section className="panel">
        <h2>Write A Review</h2>
        <form className="stack-sm" onSubmit={submitReview}>
          <input className="input-field" placeholder="Title" value={reviewForm.title} onChange={(event) => setReviewForm((v) => ({ ...v, title: event.target.value }))} />
          <textarea className="input-field" rows={4} placeholder="Comment" value={reviewForm.comment} onChange={(event) => setReviewForm((v) => ({ ...v, comment: event.target.value }))} />
          <input className="input-field" type="number" min={1} max={5} value={reviewForm.rating} onChange={(event) => setReviewForm((v) => ({ ...v, rating: event.target.value }))} />
          <button className="btn-primary" type="submit">Submit Review</button>
        </form>
      </section>

      <section className="panel">
        <h2>Community Reviews</h2>
        {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => (
          <article key={review.id} className="review-row">
            <div>
              <h3>{review.title || 'Untitled'}</h3>
              <p>{review.comment || 'No comment.'}</p>
            </div>
            <strong>{review.rating}/5</strong>
          </article>
        ))}
      </section>
    </div>
  )
}
