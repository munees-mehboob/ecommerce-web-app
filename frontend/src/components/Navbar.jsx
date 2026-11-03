import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import SearchBar from './SearchBar';
import BrandLogo from './BrandLogo';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { userInfo } = useSelector((state) => state.auth);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isCustomer = Boolean(userInfo && !userInfo.isAdmin);

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    closeMenus();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div onClick={closeMenus} style={{ cursor: 'pointer' }}>
          <BrandLogo size="md" to="/" />
        </div>

        {/* Search & Navigation Links only for logged-in users */}
        {userInfo && <SearchBar />}

        {userInfo && (
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>

            {isCustomer && <Link to="/wishlist">Wishlist</Link>}

            {userInfo.isAdmin && (
              <Link to="/admin" style={{ color: '#e94560', fontWeight: 'bold' }}>
                Admin Panel
              </Link>
            )}
          </div>
        )}

        <div className="navbar-right">
          {/* Cart only visible for logged in customers */}
          {isCustomer && (
            <Link to="/cart" className="navbar-cart" aria-label={`Cart with ${cartCount} items`}>
              <span aria-hidden="true" style={{ marginRight: '6px' }}>
                &#128722;
              </span>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}

          {userInfo ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: dropdownOpen ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '4px 12px 4px 5px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  color: '#ffffff',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: userInfo.isAdmin
                      ? 'linear-gradient(135deg, #e94560, #8b5cf6)'
                      : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '12px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>
                  {userInfo.name?.split(' ')[0] || 'Account'}
                </span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>▾</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '44px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                    minWidth: '220px',
                    zIndex: 999,
                    overflow: 'hidden',
                  }}
                >
                  {/* User Profile Mini Card */}
                  <div style={{ padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{userInfo.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userInfo.email}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: userInfo.isAdmin ? 'rgba(233, 69, 96, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: userInfo.isAdmin ? '#e94560' : '#059669',
                      }}
                    >
                      {userInfo.isAdmin ? 'Administrator' : 'Customer Account'}
                    </span>
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        color: '#334155',
                        fontSize: '13px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      My Profile
                    </Link>

                    {!userInfo.isAdmin && (
                      <Link
                        to="/orders/history"
                        onClick={closeMenus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          color: '#334155',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Purchase History
                      </Link>
                    )}

                    {isCustomer && (
                      <Link
                        to="/wishlist"
                        onClick={closeMenus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          color: '#334155',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Saved Wishlist
                      </Link>
                    )}

                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          color: '#e94560',
                          fontSize: '13px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Admin CRM Portal
                      </Link>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px 0' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        color: '#e11d48',
                        fontSize: '13px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="navbar-btn-login">
                Login
              </Link>
              <Link to="/signup" className="navbar-btn-signup">
                Sign Up
              </Link>
            </div>
          )}

          {userInfo && (
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>

      {userInfo && (
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenus}>
            Products
          </Link>

          {isCustomer && (
            <>
              <Link to="/wishlist" onClick={closeMenus}>
                Wishlist
              </Link>
              <Link to="/cart" onClick={closeMenus}>
                Cart ({cartCount})
              </Link>
            </>
          )}

          <Link to="/profile" onClick={closeMenus}>
            Profile
          </Link>
          {!userInfo.isAdmin && (
            <Link to="/orders/history" onClick={closeMenus}>
              Purchase History
            </Link>
          )}
          {userInfo.isAdmin && (
            <Link to="/admin" onClick={closeMenus}>
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              color: '#e94560',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              textAlign: 'left',
              padding: '8px 0',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
