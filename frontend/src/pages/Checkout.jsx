import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCart } from '../hooks/useCart'
import { checkoutFromCart } from '../services/orderService'
import { createPaymentIntent, confirmPayment } from '../services/paymentService'
import { currency } from '../utils/helpers'

const EMPTY_SHIPPING = {
  shipping_name: '',
  shipping_phone: '',
  shipping_address1: '',
  shipping_address2: '',
  shipping_city: '',
  shipping_state: '',
  shipping_postal_code: '',
  shipping_country: 'India',
}

export default function Checkout() {
  const token = useAuthStore((state) => state.token)
  const { cart, refresh } = useCart()
  const [status, setStatus] = useState('')
  const [processing, setProcessing] = useState(false)
  const [shipping, setShipping] = useState(EMPTY_SHIPPING)

  if (!token) return <section className="panel"><h1>Checkout</h1><p>Please login first.</p><Link to="/auth" className="btn-primary">Sign In</Link></section>

  const setField = (field, value) => setShipping((current) => ({ ...current, [field]: value }))

  const missingRequired = ['shipping_name', 'shipping_phone', 'shipping_address1', 'shipping_city', 'shipping_state', 'shipping_postal_code'].some((key) => !shipping[key].trim())

  const payNow = async () => {
    setProcessing(true)
    setStatus('Creating order...')
    try {
      const order = await checkoutFromCart({
        currency: 'INR',
        ...shipping,
      })
      const intent = await createPaymentIntent(order.id)
      const result = await confirmPayment(order.id, intent.payment_intent_id)
      await refresh()
      setStatus(`Payment ${result.status}. Order #${result.order_id} confirmed.`)
    } catch (error) {
      setStatus(error?.response?.data?.detail || 'Checkout failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <section className="panel stack-sm">
      <p className="eyebrow">Final Step</p>
      <h1>Checkout</h1>
      <p>Secure simulated payment connected to backend endpoints.</p>

      <div className="checkout-grid">
        <div className="stack-sm">
          <h2>Delivery Details</h2>
          <input className="input-field" placeholder="Full name" value={shipping.shipping_name} onChange={(event) => setField('shipping_name', event.target.value)} />
          <input className="input-field" placeholder="Phone number" value={shipping.shipping_phone} onChange={(event) => setField('shipping_phone', event.target.value)} />
          <input className="input-field" placeholder="Address line 1" value={shipping.shipping_address1} onChange={(event) => setField('shipping_address1', event.target.value)} />
          <input className="input-field" placeholder="Address line 2 (optional)" value={shipping.shipping_address2} onChange={(event) => setField('shipping_address2', event.target.value)} />
          <div className="row-gap">
            <input className="input-field" placeholder="City" value={shipping.shipping_city} onChange={(event) => setField('shipping_city', event.target.value)} />
            <input className="input-field" placeholder="State" value={shipping.shipping_state} onChange={(event) => setField('shipping_state', event.target.value)} />
          </div>
          <div className="row-gap">
            <input className="input-field" placeholder="Postal code" value={shipping.shipping_postal_code} onChange={(event) => setField('shipping_postal_code', event.target.value)} />
            <input className="input-field" placeholder="Country" value={shipping.shipping_country} onChange={(event) => setField('shipping_country', event.target.value)} />
          </div>
        </div>

        <div className="panel checkout-summary">
          <p className="eyebrow">Order Summary</p>
          <h2 className="price-tag">{currency(cart.total)}</h2>
          <p>{cart.items.length} items in your cart</p>
          <button className="btn-primary" disabled={processing || cart.items.length === 0 || missingRequired} onClick={payNow}>
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
          {missingRequired ? <p className="status-line">Fill delivery details to continue.</p> : null}
        </div>
      </div>

      {status ? <p className="status-line">{status}</p> : null}
    </section>
  )
}
