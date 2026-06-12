import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get state from both slices
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { userInfo } = useSelector((state) => state.auth);

  // 2. Calculate the total quantity of items in the cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">🛒 ShopNow</Link>

            <SearchBar />

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist">Wishlist</Link>
          {userInfo?.isAdmin && (
            <Link to="/admin" style={{ color: '#e94560' }}>Admin</Link>
          )}
        </div>

        <div className="navbar-right">
          <Link to="/cart" className="navbar-cart">
            🛒
            {/* 3. Update the static '0' to {cartCount} */}
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: '#e94560',
                  color: 'white',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {userInfo.name.split(' ')[0]} ▾
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: '160px',
                  zIndex: 999,
                  overflow: 'hidden',
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: 'block', padding: '12px 16px', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}
                  >
                    👤 Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '12px 16px', color: '#333', fontSize: '14px', borderBottom: '1px solid #eee' }}
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', color: '#e94560', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn-login">Login</Link>
              <Link to="/signup" className="navbar-btn-signup">Sign Up</Link>
            </>
          )}

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
        {/* 4. Update the mobile cart link too */}
        <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart ({cartCount})
        </Link>
        {userInfo ? (
          <>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <button onClick={handleLogout} style={{ color: '#e94560', background: 'none', border: 'none', fontSize: '16px', textAlign: 'left', padding: '8px 0', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
