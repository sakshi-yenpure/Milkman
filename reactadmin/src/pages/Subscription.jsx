import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Subscription() {
  const [plan, setPlan] = useState('weekly')
  const [slot, setSlot] = useState('morning')
  const proceed = () => {
    localStorage.setItem('subscriptionPlan', JSON.stringify({ plan, slot }))
    window.location.href = '/subscription-billing'
  }
  return (
    <div className="reveal subscription-page">
      <div className="sub-hero glow-card">
        <div>
          <h2 className="gradient-title">Subscription Plans</h2>
          <p className="muted">Flexible schedules, prioritized delivery, and great value.</p>
        </div>
        <div className="chips">
          <span className="chip">Daily</span>
          <span className="chip">Weekly</span>
          <span className="chip">Custom</span>
        </div>
      </div>
      <div className="grid">
        <div className={`card glow-card ${plan==='daily' ? 'selected' : ''} reveal`}>
          <div className="card-body" style={{borderTop:'4px solid #4e9b51'}}>
            <h3>Daily Delivery</h3>
            <p className="muted">Fresh dairy delivered every day.</p>
            <ul>
              <li>Best freshness</li>
              <li>Flexible quantities</li>
            </ul>
            <button className="btn btn-secondary" onClick={() => setPlan('daily')}>Select</button>
          </div>
        </div>
        <div className={`card glow-card ${plan==='weekly' ? 'selected' : ''} reveal`}>
          <div className="card-body" style={{borderTop:'4px solid #0d6efd'}}>
            <h3>Weekly Delivery</h3>
            <p className="muted">Deliveries once or twice a week.</p>
            <ul>
              <li>Great for planning</li>
              <li>Easy to reschedule</li>
            </ul>
            <button className="btn btn-secondary" onClick={() => setPlan('weekly')}>Select</button>
          </div>
        </div>
        <div className={`card glow-card ${plan==='custom' ? 'selected' : ''} reveal`}>
          <div className="card-body" style={{borderTop:'4px solid #fb8500'}}>
            <h3>Custom Schedule</h3>
            <p className="muted">Pick specific days and quantities.</p>
            <ul>
              <li>Maximum flexibility</li>
              <li>Tailored to your needs</li>
            </ul>
            <button className="btn btn-secondary" onClick={() => setPlan('custom')}>Select</button>
          </div>
        </div>
      </div>
      <div style={{marginTop:16}} className="card glow-card reveal">
        <div className="card-body" style={{borderTop:'4px solid #5aa95d'}}>
          <h3>Preferences</h3>
          <div className="form-grid">
            <select value={slot} onChange={e=>setSlot(e.target.value)}>
              <option value="morning">Morning (7–10 AM)</option>
              <option value="afternoon">Afternoon (1–4 PM)</option>
              <option value="evening">Evening (6–9 PM)</option>
            </select>
            <Link className="btn btn-primary" to="/products">Add Products</Link>
            <button className="btn btn-secondary" onClick={proceed}>Proceed to Subscription Billing</button>
          </div>
        </div>
      </div>
    </div>
  )
}
