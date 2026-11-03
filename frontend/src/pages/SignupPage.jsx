import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <div
        className="card"
        style={{
          width: '100%',
          padding: '26px 24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Compact Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <img
            src="/logo.jpg"
            alt="ShopNow"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(233, 69, 96, 0.25)',
              margin: '0 auto 6px',
              display: 'block',
            }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 2px', color: '#0f172a' }}>
            Create Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Join ShopNow and start shopping today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '11px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '11px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '11px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#e94560',
              border: 'none',
              color: '#fff',
              boxShadow: '0 3px 10px rgba(233,69,96,0.25)',
              transition: 'background-color 0.2s ease',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e94560', fontWeight: '700', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;