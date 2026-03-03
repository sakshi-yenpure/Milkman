import { useEffect, useState } from 'react'

const API = 'http://127.0.0.1:8000'

export default function SubscriptionBilling() {
  const [customer] = useState(() => JSON.parse(localStorage.getItem('customer') || '{}'))
  const [items, setItems] = useState([])
  const [plan, setPlan] = useState(() => JSON.parse(localStorage.getItem('subscriptionPlan') || 'null'))
  const [status, setStatus] = useState(null)
  const [payment, setPayment] = useState('cod')
  const [showCard, setShowCard] = useState(false)
  const [showUpi, setShowUpi] = useState(false)
  const [card, setCard] = useState({ name:'', number:'', expiry:'', cvv:'' })
  const [upi, setUpi] = useState({ id:'' })
  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const doSubmit = async () => {
    if (!customer.id) { setStatus('login_required'); return }
    if (!items.length) { setStatus('no_items'); return }
    setStatus('processing')
    const payload = {
      customer_id: customer.id,
      items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      delivery_slot: plan?.slot || 'morning',
      payment_method: payment,
    }
    try {
      const r = await fetch(API + '/subscription/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!r.ok) throw new Error('failed')
      const data = await r.json()
      localStorage.removeItem('cart')
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push({ ts: Date.now(), items, total, billing: payload, type: 'subscription' })
      localStorage.setItem('orders', JSON.stringify(orders))
      setStatus('success')
      window.dispatchEvent(new CustomEvent('toast', { detail: 'Subscription purchased successfully' }))
    } catch (e) {
      setStatus('error')
    }
  }
  const submit = async () => {
    if (payment === 'card') { setShowCard(true); return }
    if (payment === 'upi') { setShowUpi(true); return }
    await doSubmit()
  }
  const confirmCard = async (e) => {
    e.preventDefault()
    if (!card.name || !card.number || !card.expiry || !card.cvv) return
    setShowCard(false)
    await doSubmit()
  }
  const confirmUpi = async (e) => {
    e.preventDefault()
    if (!upi.id) return
    setShowUpi(false)
    await doSubmit()
  }

  return (
    <div className="reveal">
      <h2>Subscription Billing</h2>
      {!plan && <div className="muted">No plan selected. Please choose a plan on the Subscription page.</div>}
      <div className="checkout-grid" style={{marginTop: 16}}>
        <div className="card reveal">
          <div className="card-body" style={{borderTop:'4px solid #0d6efd'}}>
            <h3>Plan Summary</h3>
            {plan ? (
              <div className="form-grid">
                <div><strong>Plan:</strong> {plan.plan}</div>
                <div><strong>Preferred Slot:</strong> {plan.slot}</div>
              </div>
            ) : <div className="muted">No plan selected</div>}
            <h3 style={{marginTop:16}}>Payment</h3>
            <div className="payment-options">
              <div className={`payment-tile ${payment==='cod' ? 'selected' : ''}`} onClick={()=>setPayment('cod')}>
                <input type="radio" name="payment" value="cod" checked={payment==='cod'} readOnly />
                <span>Cash on Delivery</span>
              </div>
              <div className={`payment-tile ${payment==='card' ? 'selected' : ''}`} onClick={()=>setPayment('card')}>
                <input type="radio" name="payment" value="card" checked={payment==='card'} readOnly />
                <span>Credit / Debit Card</span>
              </div>
              <div className={`payment-tile ${payment==='upi' ? 'selected' : ''}`} onClick={()=>setPayment('upi')}>
                <input type="radio" name="payment" value="upi" checked={payment==='upi'} readOnly />
                <span>UPI</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card order-card reveal">
          <div className="card-body" style={{borderTop:'4px solid #5aa95d'}}>
            <h3>Items</h3>
            {items.length === 0 && <div className="muted">Your cart is empty. Add products first.</div>}
            {items.length > 0 && (
              <>
                <ul className="order-list">
                  {items.map((i, idx) => (
                    <li key={idx}>
                      <span>{i.name} × {i.quantity}</span>
                      <span>${(Number(i.price) * i.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="order-total">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </>
            )}
            <button className="btn btn-primary" onClick={submit} disabled={status==='processing' || items.length===0}>Confirm Subscription</button>
            {status === 'login_required' && <div className="error mt-2">Login required</div>}
            {status === 'no_items' && <div className="error mt-2">Add at least one product</div>}
            {status === 'success' && <div className="success mt-2">Subscription purchased</div>}
            {status === 'error' && <div className="error mt-2">Failed to purchase subscription</div>}
          </div>
        </div>
        {showCard && (
          <div className="modal">
            <div className="modal-card">
              <h3>Pay by Card</h3>
              <form onSubmit={confirmCard} className="form-grid">
                <input type="text" placeholder="Name on Card" value={card.name} onChange={e=>setCard({...card, name:e.target.value})} required />
                <input type="text" placeholder="Card Number" value={card.number} onChange={e=>setCard({...card, number:e.target.value})} required />
                <input type="text" placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card, expiry:e.target.value})} required />
                <input type="password" placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card, cvv:e.target.value})} required />
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-primary" type="submit">Pay & Confirm</button>
                  <button className="btn btn-secondary" type="button" onClick={()=>setShowCard(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showUpi && (
          <div className="modal">
            <div className="modal-card">
              <h3>Pay by UPI</h3>
              <form onSubmit={confirmUpi} className="form-grid">
                <input type="text" placeholder="UPI ID (e.g., name@bank)" value={upi.id} onChange={e=>setUpi({ id:e.target.value })} required />
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-primary" type="submit">Pay & Confirm</button>
                  <button className="btn btn-secondary" type="button" onClick={()=>setShowUpi(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
