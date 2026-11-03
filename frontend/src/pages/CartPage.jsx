import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [isClearCartOpen, setIsClearCartOpen] = useState(false);

  const handleQtyChange = (id, newQty) => {
    dispatch(updateQuantity({ id, qty: Number(newQty) }));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
    toast.success(`${item.title} removed from cart`);
  };

  const handleConfirmClearCart = () => {
    dispatch(clearCart());
    setIsClearCartOpen(false);
    toast.success('Shopping cart emptied');
  };

  const checkoutHandler = () => {
    navigate(userInfo ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <div className="cart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Your Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearCartOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Empty Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-mark">Cart</div>
          <h3>Your cart is empty</h3>
          <p>Explore products and add your favorites here.</p>
          <Link to="/products" className="checkout-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '1rem', textDecoration: 'none' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
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
                    aria-label={`Quantity for ${item.title}`}
                  >
                    {[...Array(Math.max(1, Math.min(Number(item.stock) || 1, 10))).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    style={{ background: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#e94560', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

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

            <button onClick={checkoutHandler} className="checkout-btn" type="button">
              Proceed to Checkout
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
              Secure checkout
            </p>
          </div>
        </div>
      )}

      {/* Confirm Modal for Empty Cart */}
      <ConfirmModal
        isOpen={isClearCartOpen}
        title="Empty Shopping Cart"
        message="Are you sure you want to remove all items from your shopping cart? This cannot be undone."
        confirmText="Yes, Empty Cart"
        confirmColor="#e94560"
        onConfirm={handleConfirmClearCart}
        onCancel={() => setIsClearCartOpen(false)}
      />
    </div>
  );
};

export default CartPage;
