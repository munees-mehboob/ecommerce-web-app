import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import '../styles/CheckoutPage.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: address,
        city,
        postalCode,
        paymentMethod,
        totalPrice,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);

      toast.success('Order Placed Successfully! 🎉');
      dispatch(clearCart()); 
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty, show a friendly empty state instead of just redirecting
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your cart is feeling light...</h2>
        <p>Add some items to your cart to proceed with checkout.</p>
        <button className="place-order-btn" style={{ maxWidth: '200px' }} onClick={() => navigate('/products')}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-layout">
        {/* Left Side: Information Gathering */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          
          <section className="form-section">
            <h3>Shipping Details</h3>
            <div className="form-group">
              <label>Street Address</label>
              <input 
                type="text" 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="e.g. 123 Digital Ave" 
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
                  placeholder="New York" 
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  required 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  placeholder="10001" 
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === 'PayPal' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment"
                  value="PayPal" 
                  checked={paymentMethod === 'PayPal'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>PayPal or Credit Card</span>
              </label>
              
              <label className={`payment-card ${paymentMethod === 'Stripe' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment"
                  value="Stripe" 
                  checked={paymentMethod === 'Stripe'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                <span>Stripe (Instant)</span>
              </label>
            </div>
          </section>

          <button 
            type="submit" 
            className="place-order-btn" 
            disabled={loading}
          >
            {loading ? 'Processing...' : `Place Order • Rs. ${totalPrice.toFixed(2)}`}
          </button>
        </form>

        {/* Right Side: Sticky Order Summary */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-qty">{item.qty}</span>
                  <span className="item-name">{item.title}</span>
                </div>
                <span className="item-price">Rs.{(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <span>Total Amount</span>
            <span>Rs.{totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;