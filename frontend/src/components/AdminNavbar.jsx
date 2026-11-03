import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out from Admin CRM');
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/users' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        {/* Brand & Portal Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrandLogo size="md" textColor="#ffffff" to="/admin" />
          <span
            className="admin-badge-portal"
            style={{
              background: 'linear-gradient(135deg, #e94560 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              boxShadow: '0 2px 8px rgba(233, 69, 96, 0.4)',
            }}
          >
            CRM PORTAL
          </span>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="admin-nav-tabs">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="admin-nav-link"
                style={{
                  fontWeight: active ? '700' : '500',
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? 'rgba(233, 69, 96, 0.2)' : 'transparent',
                  border: active ? '1px solid rgba(233, 69, 96, 0.4)' : '1px solid transparent',
                }}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: View Store & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Switch to customer live store */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Live Store</span>
          </Link>

          {/* Admin User Info & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e94560, #4f46e5)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {userInfo?.name?.charAt(0) || 'A'}
            </div>

            <div className="admin-profile-name" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>
                {userInfo?.name || 'Administrator'}
              </span>
              <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>
                Admin Active
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout from CRM"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
