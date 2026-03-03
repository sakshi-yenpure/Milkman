import { useEffect, useState } from 'react'
const API = 'http://127.0.0.1:8000'

export default function AdminPortal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [staff, setStaff] = useState([])
  const token = localStorage.getItem('staffToken') || ''

  const fetchStaff = async () => {
    try {
      const r = await fetch(API + '/staff/staff/', {
        headers: token ? { Authorization: 'Token ' + token } : {}
      })
      if (!r.ok) throw new Error('Unauthorized')
      const data = await r.json()
      setStaff(data)
    } catch (e) {
      setStaff([])
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const r = await fetch(API + '/staff/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const text = await r.text()
      let data = {}
      try { data = JSON.parse(text || '{}') } catch {}
      if (!r.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('staffToken', data.token)
      localStorage.setItem('staffUser', JSON.stringify({ id: data.staff_id, email: data.email }))
      await fetchStaff()
    } catch (e) {
      setError(e.message || 'Network error')
    }
  }

  return (
    <div>
      <h2>Staff Admin</h2>
      {!token && (
        <div className="card">
          <div className="card-body">
            <h3>Staff Login / Sign Up</h3>
            <p className="muted">New staff are created automatically on first login.</p>
            <form onSubmit={submit} className="form-grid">
              <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
              {error && <div className="error">{error}</div>}
              <button className="btn btn-primary" type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
      <div className="card" style={{marginTop:16}}>
        <div className="card-body">
          <h3>Staff List</h3>
          {staff.length === 0 && <div className="muted">Login to view staff list</div>}
          {staff.length > 0 && (
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>{s.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
