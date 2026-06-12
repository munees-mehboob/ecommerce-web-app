import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import '../styles/CartPage.css'; 

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const handleQtyChange = (id, newQty) => {
    dispatch(updateQuantity({ id, qty: Number(newQty) }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

// frontend/src/pages/CartPage.jsx

const checkoutHandler = () => {
  // Change '/shipping' to '/checkout' to match your App.jsx
  if (!userInfo) {
    navigate('/login?redirect=/checkout');
  } else {
    navigate('/checkout');
  }
};

  return (
    <div className="cart-container">
      <h1 className="section-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h3 style={{ color: 'var(--text-muted)' }}>Your cart is empty</h3>
          <Link to="/products" className="checkout-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '1.5rem', textDecoration: 'none' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* 1. Left Side: Items List */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.id}`} style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                  <p style={{ color: 'var(--primary)', fontWeight: '700', marginTop: '4px' }}>
                    Rs. {Number(item.price).toLocaleString()}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select 
                    value={item.qty} 
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                  >
                    {[...Array(item.stock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <button 
                    onClick={() => handleRemove(item.id)} 
                    style={{ background: 'none', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.5 }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Right Side: Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <button onClick={checkoutHandler} className="checkout-btn">
              Proceed to Checkout
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
              🔒 Secure checkout powered by MySQL
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;