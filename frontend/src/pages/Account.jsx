import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { listOrders } from '../services/orderService'
import { currency } from '../utils/helpers'

export default function Account() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const logout = useAuthStore((state) => state.logout)

  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ email: '', username: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!user) return
    setForm({ email: user.email, username: user.username })
  }, [user])

  useEffect(() => {
    if (!token) return
    listOrders().then(setOrders).catch(() => setOrders([]))
  }, [token])

  if (!token) return <section className="panel"><h1>Account</h1><p>Please login.</p><Link className="btn-primary" to="/auth">Sign In</Link></section>

  const save = async (event) => {
    event.preventDefault()
    try {
      await updateProfile(form)
      setStatus('Profile updated.')
    } catch (error) {
      setStatus(error?.response?.data?.detail || 'Unable to update profile.')
    }
  }

  return (
    <div className="stack-lg">
      <section className="panel stack-sm">
        <div className="row-between">
          <h1>Account</h1>
          <button className="btn-ghost" type="button" onClick={logout}>Logout</button>
        </div>
        <form className="stack-sm" onSubmit={save}>
          <input className="input-field" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
          <input className="input-field" value={form.username} onChange={(e) => setForm((v) => ({ ...v, username: e.target.value }))} />
          <button className="btn-primary" type="submit">Save Profile</button>
        </form>
        {status ? <p className="status-line">{status}</p> : null}
      </section>

      <section className="panel stack-sm">
        <h2>Orders</h2>
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order) => (
          <article key={order.id} className="order-row order-detail">
            <div>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status} | Delivery: {order.delivery_status}</p>
              <p>{order.shipping_address1}{order.shipping_address2 ? `, ${order.shipping_address2}` : ''}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
            </div>
            <strong>{currency(order.total_amount)}</strong>
          </article>
        ))}
      </section>
    </div>
  )
}
