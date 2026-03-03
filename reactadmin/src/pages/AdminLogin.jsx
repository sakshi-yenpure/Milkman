import { useState } from 'react'
const API = 'http://127.0.0.1:8000'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

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
      window.location.href = 'http://localhost:3000/#!/staff'
    } catch (e) {
      setError(e.message || 'Network error')
    }
  }

  return (
    <div className="auth-card">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  )
}
