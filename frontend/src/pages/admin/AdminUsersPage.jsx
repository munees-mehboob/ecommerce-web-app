import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Loader from '../../components/Loader';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        if (!active) return;
        setUsers(data);
      } catch {
        if (active) toast.error('Failed to load customers');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, [userInfo]);

  // Only display real customers (admins excluded)
  const customers = useMemo(() => {
    return users.filter((u) => !u.isAdmin);
  }, [users]);

  // Filtered by search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  if (loading) return <Loader />;

  return (
    <div className="admin-page-container">
      {/* Header with Title and Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Customer Directory
            </h1>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '999px',
                background: '#e0f2fe',
                color: '#0284c7',
              }}
            >
              {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Manage registered store customer accounts and membership details.
          </p>
        </div>

        {/* Quick Search Bar */}
        <div style={{ minWidth: '260px', flex: '1 1 260px', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Search customer by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  CUSTOMER
                </th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  EMAIL ADDRESS
                </th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  ACCOUNT STATUS
                </th>
                <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  MEMBER SINCE
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                    <div style={{ marginBottom: '12px', color: '#94a3b8' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
                      {searchQuery ? 'No matching customers found' : 'No customers registered yet'}
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>
                      {searchQuery
                        ? 'Try searching with a different name or email.'
                        : 'New customers who register or shop in your store will appear here.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((user) => (
                  <tr key={user.id || user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '13px',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Verified Account</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569', fontSize: '13px' }}>{user.email}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <span style={{ fontSize: '9px' }}>●</span> Active Customer
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '13px' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
