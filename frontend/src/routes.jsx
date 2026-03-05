import { Suspense, lazy, useEffect } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Logo from './components/Logo'
import { useAuthStore } from './store/authStore'

const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Account = lazy(() => import('./pages/Account'))
const Auth = lazy(() => import('./pages/Auth'))

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <p className="eyebrow">WOLFz</p>
      <h2>Loading</h2>
    </div>
  )
}

export default function AppRoutes() {
  const token = useAuthStore((state) => state.token)
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <NavLink className="brand-lockup" to="/">
            <Logo />
            <div>
              <p className="brand-name">WOLFz PREMIUM CLOTHING</p>
              <p className="brand-sub">T-Shirt Studio</p>
            </div>
          </NavLink>
          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            <NavLink to="/checkout">Checkout</NavLink>
            {token ? <NavLink to="/account">Account</NavLink> : <NavLink to="/auth">Login</NavLink>}
          </nav>
        </div>
      </header>

      <main className="container page-wrap">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>WOLFz Premium Clothing</p>
          <p>Built for everyday statement wear.</p>
        </div>
      </footer>
    </div>
  )
}
