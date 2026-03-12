import { useEffect, useState } from 'react'
const API = 'http://127.0.0.1:8000'

export default function AdminPortal() {
  const [activities, setActivities] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('activities')
  const token = localStorage.getItem('staffToken') || ''

  const fetchActivities = async () => {
    try {
      const r = await fetch(API + '/staff/activities/', {
        headers: token ? { Authorization: 'Token ' + token } : {}
      })
      if (!r.ok) throw new Error('Unauthorized')
      const data = await r.json()
      setActivities(data)
    } catch (e) {
      console.error('Failed to fetch activities:', e)
    }
  }

  const fetchProducts = async () => {
    try {
      const r = await fetch(API + '/product/product/', {
        headers: token ? { Authorization: 'Token ' + token } : {}
      })
      if (!r.ok) throw new Error('Failed to fetch products')
      const data = await r.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchCategories = async () => {
    try {
      const r = await fetch(API + '/category/category/', {
        headers: token ? { Authorization: 'Token ' + token } : {}
      })
      if (!r.ok) throw new Error('Failed to fetch categories')
      const data = await r.json()
      setCategories(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!token) {
      window.location.href = '/admin'
      return
    }

    fetchActivities()
    fetchProducts()
    fetchCategories()
    const interval = setInterval(fetchActivities, 3000)
    return () => clearInterval(interval)
  }, [token])

  const handleUpdatePrice = async (id, newPrice) => {
    try {
      const r = await fetch(`${API}/product/product/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify({ price: newPrice })
      })
      if (r.ok) {
        window.dispatchEvent(new CustomEvent('toast', { detail: 'Price updated successfully' }))
        fetchProducts()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const r = await fetch(`${API}/product/product/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Token ' + token }
      })
      if (r.ok) {
        window.dispatchEvent(new CustomEvent('toast', { detail: 'Product deleted' }))
        fetchProducts()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const r = await fetch(`${API}/product/product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify(newProduct)
      })
      if (r.ok) {
        window.dispatchEvent(new CustomEvent('toast', { detail: 'Product added successfully' }))
        setShowAddModal(false)
        setNewProduct({ name: '', price: '', category: '', description: '' })
        fetchProducts()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const r = await fetch(`${API}/product/product/${editingProduct.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify(editingProduct)
      })
      if (r.ok) {
        window.dispatchEvent(new CustomEvent('toast', { detail: 'Product updated successfully' }))
        setEditingProduct(null)
        fetchProducts()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="gradient-title">Admin Portal</h1>
            <p className="muted">Managing Employees & Products</p>
          </div>
          <div className="header-right">
            <div className="tab-group" style={{ display: 'flex', gap: '10px', marginRight: '20px' }}>
              <button 
                className={`btn ${activeTab === 'activities' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('activities')}
              >Activities</button>
              <button 
                className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('products')}
              >Products</button>
            </div>
            <span className="staff-badge">Admin Mode</span>
          </div>
        </header>

        {activeTab === 'activities' ? (
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="card reveal activity-card">
              <div className="card-body">
                <div className="card-header">
                  <h3>Employee Activity Feed (Live)</h3>
                  <span className="live-dot">Database Sync</span>
                </div>
                <div className="activity-list">
                  {activities.length === 0 ? (
                    <p className="muted">No recent employee activities found in database.</p>
                  ) : (
                    activities.map((act, i) => (
                      <div key={i} className={`activity-item ${act.action.toLowerCase().replace(' ', '-')}`}>
                        <div className="activity-icon">
                          {act.action.includes('Logged in') && '🔑'}
                          {act.action.includes('Signed up') && '✨'}
                          {act.action.includes('Logged out') && '🚪'}
                        </div>
                        <div className="activity-content">
                          <p><strong>{act.email}</strong> {act.action}</p>
                          <span className="activity-time">{new Date(act.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="card reveal">
              <div className="card-body">
                <div className="card-header">
                  <h3>Product Management</h3>
                  <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Product</button>
                </div>
                <div className="table-responsive" style={{ marginTop: '20px' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td>{p.name}</td>
                          <td>{categories.find(c => c.id === p.category)?.name || 'N/A'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              $ <input 
                                type="number" 
                                defaultValue={p.price} 
                                style={{ width: '80px', padding: '4px' }}
                                onBlur={(e) => handleUpdatePrice(p.id, e.target.value)}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => setEditingProduct(p)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ff4d4d', color: 'white' }}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-card" style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '400px' }}>
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-primary" type="submit">Save Product</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-card" style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '400px' }}>
              <h3>Edit Product</h3>
              <form onSubmit={handleUpdateProduct} className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <input type="text" placeholder="Product Name" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required />
                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <textarea placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-primary" type="submit">Update Product</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
