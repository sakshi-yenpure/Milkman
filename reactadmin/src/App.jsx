import { BrowserRouter, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminLogin from './pages/AdminLogin'
import AdminPortal from './pages/AdminPortal'
import Subscription from './pages/Subscription'
import Profile from './pages/Profile'
import SubscriptionBilling from './pages/SubscriptionBilling'

function Layout({ children }) {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(() => !!(localStorage.getItem('customerToken') || localStorage.getItem('staffToken')))
  const [toast, setToast] = useState(null)
  const logout = () => {
    localStorage.removeItem('cart')
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customer')
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    setAuthed(false)
    window.location.href = '/'
  }
  useEffect(() => {
    const handler = (e) => {
      setToast(e.detail || 'Done')
      setTimeout(() => setToast(null), 2000)
    }
    window.addEventListener('toast', handler)
    const storageHandler = () => {
      const hasAuth = !!(localStorage.getItem('customerToken') || localStorage.getItem('staffToken'))
      setAuthed(hasAuth)
    }
    window.addEventListener('storage', storageHandler)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => {
      window.removeEventListener('toast', handler)
      window.removeEventListener('storage', storageHandler)
      observer.disconnect()
    }
  }, [])
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="brand"><Link to="/">Milkman</Link></div>
          <div className="nav-links">
            <a onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{cursor:'pointer'}}>Home</a>
            <Link to="/products">Products</Link>
            <a onClick={() => { navigate('/subscription'); }} style={{cursor:'pointer'}}>Subscribe</a>
            <Link to="/cart">Cart</Link>
            {authed && <Link to="/profile">My Profile</Link>}
            {!authed && <Link to="/login">Login</Link>}
            {!authed && <Link to="/signup">Sign Up</Link>}
            <Link to="/admin-portal">Staff Admin</Link>
            {authed && <button className="link-button" onClick={logout}>Logout</button>}
          </div>
        </div>
      </nav>
      <main className="container">{children}</main>
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} Milkman</div>
      </footer>
      {toast && (
        <div className="toast">{toast}</div>
      )}
    </div>
  )
}

const API = 'http://127.0.0.1:8000'

function FeaturedProducts() {
  const [items, setItems] = useState([])
  useEffect(() => {
    fetch(API + '/product/public/')
      .then(r => r.json())
      .then(d => setItems(d.slice(0, 3)))
      .catch(() => setItems([]))
  }, [])
  const add = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.product_id === p.id)
    if (existing) existing.quantity += 1
    else cart.push({ product_id: p.id, name: p.name, price: p.price, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('toast', { detail: 'Your product is added to cart' }))
  }
  return (
    <section className="container" style={{marginTop: 32}}>
      <div className="products-header" style={{marginBottom: 12}}>
        <h2>We Assure</h2>
        <Link className="btn btn-secondary" to="/products">View All</Link>
      </div>
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card product-card">
            <div className="card-body">
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <div className="product-meta">
                <span className="price">${Number(p.price).toFixed(2)}</span>
                <button className="btn btn-primary" onClick={() => add(p)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <section className="hero hero-visual reveal">
        <div className="container hero-inner">
          <h1>Fresh Milk Delivered</h1>
          <p className="hero-tagline">Premium dairy products, flexible plans, and doorstep delivery.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">Shop Products</Link>
            <Link className="btn btn-secondary" to="/subscription">Explore Subscriptions</Link>
          </div>
        </div>
      </section>
      <FeaturedProducts />
      <section className="container reveal we-assure" style={{marginTop: 32}}>
        <div className="grid">
          <div className="card reveal">
            <div className="card-body">
              <h3>Quality First</h3>
              <p className="muted">Sourced from trusted farms with rigorous checks.</p>
            </div>
          </div>
          <div className="card reveal">
            <div className="card-body">
              <h3>Flexible Plans</h3>
              <p className="muted">Subscribe to daily or weekly deliveries.</p>
            </div>
          </div>
          <div className="card reveal">
            <div className="card-body">
              <h3>Easy Billing</h3>
              <p className="muted">Transparent pricing and secure payments.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container reveal" style={{marginTop: 32}}>
        <div className="products-header" style={{marginBottom: 12}}>
          <h2>Our Products</h2>
          <Link className="btn btn-secondary" to="/products">Browse All</Link>
        </div>
        <div className="grid">
          <div className="card product-card reveal">
            <div className="product-image">
              <img src="https://images.pexels.com/photos/5946623/pexels-photo-5946623.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Milk" />
            </div>
            <div className="card-body">
              <h3>Milk</h3>
              <p className="muted">Whole, toned, and skim options.</p>
            </div>
          </div>
          <div className="card product-card reveal">
            <div className="product-image">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" alt="Cheese" />
            </div>
            <div className="card-body">
              <h3>Cheese</h3>
              <p className="muted">Cheddar, Mozzarella and more.</p>
            </div>
          </div>
          <div className="card product-card reveal">
            <div className="product-image">
              <img src="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Curd" />
            </div>
            <div className="card-body">
              <h3>Curd & Yogurt</h3>
              <p className="muted">Fresh curd and Greek yogurt.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container reveal" style={{marginTop: 32}}>
        <div className="products-header" style={{marginBottom: 12}}>
          <h2>Our Stores</h2>
          <div></div>
        </div>
        <div className="grid">
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>Mumbai Central</h3>
              <p className="muted">Visit our flagship store.</p>
            </div>
          </div>
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>Bengaluru Indiranagar</h3>
              <p className="muted">Fresh dairy, daily.</p>
            </div>
          </div>
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>Hyderabad Banjara Hills</h3>
              <p className="muted">Premium selection and service.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container reveal" style={{marginTop: 32}}>
        <div className="products-header" style={{marginBottom: 12}}>
          <h2>Our Stats</h2>
          <div></div>
        </div>
        <div className="grid">
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>1,200+</h3>
              <p className="muted">Daily Orders</p>
            </div>
          </div>
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>98%</h3>
              <p className="muted">On-time Delivery</p>
            </div>
          </div>
          <div className="card reveal gradient-card">
            <div className="card-body">
              <h3>10+</h3>
              <p className="muted">Cities Served</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container reveal" style={{marginTop: 32}}>
        <div className="card reveal">
          <div className="card-body" style={{background:'linear-gradient(135deg, #2f7d32, #5aa95d)', borderRadius:12, color:'#fff'}}>
            <h3 style={{color:'#fff'}}>Subscribe & Save</h3>
            <p style={{opacity:.95}}>Lock in convenience and freshness with flexible delivery slots.</p>
            <ul>
              <li>Daily or weekly plans</li>
              <li>Change or pause anytime</li>
              <li>Priority delivery</li>
            </ul>
            <Link className="btn btn-secondary" to="/subscription">Start Subscription</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscription-billing" element={<SubscriptionBilling />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
