import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { setCredentials } from '../redux/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Profile form state initialized from logged-in user
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'security'

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (activeTab === 'security') {
      if (!password) {
        toast.error('Please enter a new password');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const { data } = await api.put('/auth/profile', updateData);

      dispatch(setCredentials(data));
      toast.success(
        activeTab === 'security'
          ? 'Password updated successfully!'
          : 'Profile details updated!'
      );
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '36px auto', padding: '0 20px' }}>
      {/* Top Profile Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: userInfo?.isAdmin
              ? 'linear-gradient(135deg, #e94560, #8b5cf6)'
              : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '800',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            flexShrink: 0,
          }}
        >
          {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              {userInfo?.name}
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '999px',
                background: userInfo?.isAdmin ? 'rgba(233, 69, 96, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: userInfo?.isAdmin ? '#f87171' : '#34d399',
                border: userInfo?.isAdmin
                  ? '1px solid rgba(233, 69, 96, 0.4)'
                  : '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              {userInfo?.isAdmin ? 'Store Administrator' : 'Verified Customer'}
            </span>
          </div>

          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px' }}>
            {userInfo?.email}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!userInfo?.isAdmin ? (
            <Link
              to="/orders/history"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              My Orders
            </Link>
          ) : (
            <Link
              to="/admin"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#e94560',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              CRM Portal
            </Link>
          )}
        </div>
      </div>

      {/* Main Account Settings Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: activeTab === 'info' ? '#ffffff' : 'transparent',
              color: activeTab === 'info' ? '#0f172a' : '#64748b',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              borderBottom: activeTab === 'info' ? '2px solid #e94560' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Personal Information
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: activeTab === 'security' ? '#ffffff' : 'transparent',
              color: activeTab === 'security' ? '#0f172a' : '#64748b',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              borderBottom: activeTab === 'security' ? '2px solid #e94560' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Security & Password
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdateProfile} style={{ padding: '28px' }}>
          {activeTab === 'info' ? (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>
                Account Profile Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Used for order updates and receipt notifications.
                </span>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>
                Change Account Password
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '11px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#e94560',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(233, 69, 96, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Saving Changes...' : activeTab === 'security' ? 'Update Password' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
