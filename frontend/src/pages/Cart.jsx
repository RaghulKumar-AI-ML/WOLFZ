import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCart } from '../hooks/useCart'
import { currency } from '../utils/helpers'

export default function Cart() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const { cart, updateItem, removeItem, clear } = useCart()

  if (!token) {
    return (
      <section className="panel cart-auth-panel stack-sm">
        <h1>Cart</h1>
        <p>Please login to access your cart.</p>
        <div className="row-gap">
          <Link className="btn-primary" to="/auth">Sign In</Link>
          <Link className="btn-ghost" to="/shop">Continue Shopping</Link>
        </div>
      </section>
    )
  }

  return (
    <div className="stack-lg">
      <section className="section-header">
        <div>
          <h1>Cart</h1>
          <p>{cart.items.length} line items</p>
        </div>
        {cart.items.length > 0 ? <button className="btn-ghost" type="button" onClick={() => clear()}>Clear Cart</button> : null}
      </section>

      {cart.items.length === 0 ? (
        <section className="panel cart-auth-panel stack-sm">
          <p>Your cart is empty.</p>
          <Link className="btn-primary" to="/shop">Go To Shop</Link>
        </section>
      ) : (
        <section className="panel stack-sm">
          {cart.items.map((item) => (
            <article key={item.product_id} className="cart-row">
              <div>
                <h3>{item.name}</h3>
                <p>{currency(item.unit_price)}</p>
              </div>
              <div className="cart-controls">
                <input
                  className="input-field qty"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateItem(item.product_id, Math.max(1, Number(event.target.value) || 1))}
                />
                <button className="btn-ghost" type="button" onClick={() => removeItem(item.product_id)}>Remove</button>
                <strong>{currency(item.line_total)}</strong>
              </div>
            </article>
          ))}

          <div className="row-between">
            <strong>Total: {currency(cart.total)}</strong>
            <button className="btn-primary" type="button" onClick={() => navigate('/checkout')}>Checkout</button>
          </div>
        </section>
      )}
    </div>
  )
}
