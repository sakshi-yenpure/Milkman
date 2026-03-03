export default function Profile() {
  const customer = JSON.parse(localStorage.getItem('customer') || '{}')
  const orders = JSON.parse(localStorage.getItem('orders') || '[]').slice().reverse()
  const plan = JSON.parse(localStorage.getItem('subscriptionPlan') || 'null')
  if (!customer.id) {
    return <div className="auth-card reveal"><h2>My Profile</h2><div className="muted">Please login to view your profile.</div></div>
  }
  return (
    <div className="reveal profile-page">
      <div className="sub-hero glow-card">
        <div>
          <h2 className="gradient-title">My Profile</h2>
          <p className="muted">Account details, subscriptions and past orders.</p>
        </div>
      </div>
      <div className="grid">
        <div className="card glow-card reveal">
          <div className="card-body" style={{borderTop:'4px solid #0d6efd'}}>
            <h3>Account</h3>
            <p><strong>Email:</strong> {customer.email}</p>
          </div>
        </div>
        <div className="card glow-card reveal">
          <div className="card-body" style={{borderTop:'4px solid #5aa95d'}}>
            <h3>Subscription</h3>
            {plan ? (
              <div>
                <p><strong>Plan:</strong> {plan.plan}</p>
                <p><strong>Preferred Slot:</strong> {plan.slot}</p>
              </div>
            ) : (
              <div className="muted">No subscription saved. Explore plans on the Subscription page.</div>
            )}
          </div>
        </div>
      </div>
      <div style={{marginTop:16}} className="card glow-card reveal">
        <div className="card-body" style={{borderTop:'4px solid #fb8500'}}>
          <h3>Past Orders</h3>
          {orders.length === 0 && <div className="muted">No orders yet.</div>}
          {orders.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Items</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={idx}>
                    <td>{new Date(o.ts).toLocaleString()}</td>
                    <td>{o.items.map(i => `${i.name || i.product_id} x ${i.quantity}`).join(', ')}</td>
                    <td>${Number(o.total || 0).toFixed(2)}</td>
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
