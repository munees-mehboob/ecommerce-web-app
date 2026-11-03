import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { clearCart } from '../redux/cartSlice';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Shipping Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment State: 'COD' or 'Card'
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Order Success & Receipt State
  const [completedOrder, setCompletedOrder] = useState(null);

  // Quick fill helper for class demo
  const fillDemoCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardHolder(userInfo?.name || 'Munees Mehboob');
    setExpiry('12/28');
    setCvv('789');
    toast.success('Demo Visa Card filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error('Please provide a contact phone number for delivery');
      return;
    }

    if (paymentMethod === 'Card') {
      if (!cardNumber || !expiry || !cvv) {
        toast.error('Please enter the mock card details or click Quick Fill Demo Card');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate realistic payment verification delay for card
      let isPaid = false;
      let transactionId = '';

      if (paymentMethod === 'Card') {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        isPaid = true;
        transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const orderData = {
        orderItems: cartItems.map((item) => ({
          id: item.id || item._id,
          qty: item.qty,
          title: item.title,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: address,
        city,
        postalCode,
        phone,
        paymentMethod: paymentMethod === 'Card' ? 'Credit / Debit Card' : 'Cash on Delivery',
        totalPrice,
        isPaid,
        transactionId,
      };

      const { data } = await api.post('/orders', orderData);

      toast.success(isPaid ? 'Payment Verified & Order Placed!' : 'Order Placed with Cash on Delivery!');
      dispatch(clearCart());
      setCompletedOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // If order was just placed, show printable receipt modal
  if (completedOrder) {
    return (
      <div style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px' }}>
        <div
          className="receipt-modal-content"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            padding: '36px',
          }}
        >
          {/* Receipt Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/logo.jpg" alt="ShopNow" style={{ width: '42px', height: '42px', borderRadius: '10px' }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>ShopNow Order Receipt</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Official Customer Invoice</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                #{String(completedOrder.id || completedOrder._id).slice(-8).toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: completedOrder.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: completedOrder.isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: '700', color: completedOrder.isPaid ? '#047857' : '#b45309', fontSize: '14px' }}>
                {completedOrder.isPaid ? 'Payment Received & Verified' : 'Payment Pending (Cash on Delivery)'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Method: {completedOrder.paymentMethod} {completedOrder.transactionId && `• Ref: ${completedOrder.transactionId}`}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              Rs. {Number(completedOrder.totalPrice).toLocaleString()}
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>CUSTOMER INFO</span>
              <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>{userInfo?.name}</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>{userInfo?.email}</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>Phone: {completedOrder.phone}</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>DELIVERY DESTINATION</span>
              <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>{completedOrder.shippingAddress}</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>{completedOrder.city}, {completedOrder.postalCode}</div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', marginTop: '2px' }}>Express Courier Delivery</div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Purchased Items</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {(completedOrder.orderItems || completedOrder.items || []).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: idx !== (completedOrder.orderItems || []).length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.qty} × Rs. {Number(item.price).toLocaleString()}</div>
                    </div>
                  </div>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                    Rs. {(item.qty * item.price).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="receipt-modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '11px 22px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Print Receipt
            </button>
            <Link
              to="/orders/history"
              style={{
                padding: '11px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#e94560',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              View Purchase History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-state" style={{ maxWidth: '720px', margin: '60px auto' }}>
        <div className="empty-state-mark">Cart</div>
        <h2>Your cart is empty</h2>
        <p>Add items to your cart before checkout.</p>
        <button className="place-order-btn" style={{ maxWidth: '220px' }} onClick={() => navigate('/products')} type="button">
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout & Payment</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Shipping Section */}
          <section className="form-section">
            <h3>Shipping & Delivery Details</h3>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House #45, Street 12, Sector F-7"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Islamabad, Lahore, Karachi"
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 44000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Phone Number (For Courier Delivery)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +92 300 1234567"
              />
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>Choose Payment Method</h3>
              <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '700' }}>Secure Demo Payment</span>
            </div>

            <div className="payment-options">
              {/* Cash On Delivery Option */}
              <label className={`payment-card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Cash on Delivery (COD)</span>
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      Standard
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Pay in cash when courier arrives at your doorstep.
                  </div>
                </div>
              </label>

              {/* Online Card Simulation Option */}
              <label className={`payment-card ${paymentMethod === 'Card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Credit / Debit Card (Interactive Demo)</span>
                    <span style={{ fontSize: '11px', background: '#ede9fe', color: '#6366f1', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      Instant Pay
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Simulate real-time online Visa / Mastercard payment confirmation.
                  </div>
                </div>
              </label>
            </div>

            {/* If Card Payment is selected, show interactive card simulator */}
            {paymentMethod === 'Card' && (
              <div className="card-details-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    Card Simulation Details
                  </span>
                  <button type="button" onClick={fillDemoCard} className="card-quick-fill-btn">
                    Fill Demo Card
                  </button>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px' }}>Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ background: '#ffffff', letterSpacing: '1px' }}
                  />
                </div>

                <div className="form-row" style={{ gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px' }}>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Munees Mehboob"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      style={{ background: '#ffffff' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="form-group" style={{ margin: 0, flex: 1 }}>
                      <label style={{ fontSize: '12px' }}>Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0, width: '80px' }}>
                      <label style={{ fontSize: '12px' }}>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength="4"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        style={{ background: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading
              ? 'Verifying & Processing Order...'
              : paymentMethod === 'Card'
              ? `Pay Now - Rs. ${totalPrice.toLocaleString()}`
              : `Confirm Cash on Delivery - Rs. ${totalPrice.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-qty">{item.qty}</span>
                  <span className="item-name">{item.title}</span>
                </div>
                <span className="item-price">Rs. {(item.qty * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '13px', marginTop: '14px' }}>
            <span>Shipping</span>
            <span style={{ color: '#10b981', fontWeight: '700' }}>FREE Delivery</span>
          </div>

          <div className="summary-total">
            <span>Total Payable</span>
            <span style={{ color: '#e94560' }}>Rs. {totalPrice.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
