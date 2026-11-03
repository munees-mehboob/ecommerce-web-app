import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Loader from '../../components/Loader';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/stats');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };

    fetchStats();
  }, [userInfo]);

  if (!data) return <Loader />;

  return (
    <div className="admin-page-container">
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
            CRM Overview & Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Welcome back, <strong>{userInfo?.name}</strong>. Here is your store's live performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/admin/products"
            className="btn btn-primary"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: '#e94560',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Total Revenue */}
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>TOTAL REVENUE</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Rs. {Number(data.stats.totalEarnings || 0).toLocaleString()}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
            ● Updated in real-time
          </div>
        </div>

        {/* Total Orders */}
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>TOTAL ORDERS</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            {data.stats.totalOrders}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            All-time customer purchases
          </div>
        </div>

        {/* Active Customers */}
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>ACTIVE CUSTOMERS</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            {data.stats.totalUsers}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            Registered shopper accounts
          </div>
        </div>

        {/* Total Products */}
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>TOTAL PRODUCTS</span>
            <div style={{ ...styles.kpiIcon, background: 'rgba(233, 69, 96, 0.1)', color: '#e94560' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
            {data.stats.totalProducts || 8}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            Live catalog inventory items
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Quick Actions */}
      <div className="admin-dashboard-grid">
        {/* Sales Trend Chart */}
        <div style={styles.contentCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Revenue Trend (Last 7 Days)
            </h3>
            <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#64748b' }}>
              Last 7 Days
            </span>
          </div>

          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e94560" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `Rs.${val}`} />
                <Tooltip
                  formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e94560"
                  strokeWidth={3}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CRM Quick Navigation Tiles */}
        <div style={styles.contentCard}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px' }}>
            Management Hub
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/admin/orders" style={styles.quickTile}>
              <div style={{ ...styles.kpiIcon, width: '38px', height: '38px', background: '#eff6ff', color: '#2563eb' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Order Fulfillment</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>Record payments & mark shipments</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>→</div>
            </Link>

            <Link to="/admin/products" style={styles.quickTile}>
              <div style={{ ...styles.kpiIcon, width: '38px', height: '38px', background: '#fff1f2', color: '#e94560' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Product Catalog</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>Update stock, prices & discounts</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>→</div>
            </Link>

            <Link to="/admin/users" style={styles.quickTile}>
              <div style={{ ...styles.kpiIcon, width: '38px', height: '38px', background: '#f5f3ff', color: '#7c3aed' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Customer Directory</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>View all registered shopper profiles</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>→</div>
            </Link>

            <Link to="/" style={styles.quickTile}>
              <div style={{ ...styles.kpiIcon, width: '38px', height: '38px', background: '#ecfdf5', color: '#059669' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Customer Storefront</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>Preview live shop as a customer</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>→</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  kpiCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '22px 20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  },
  kpiIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  contentCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  },
  quickTile: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
};

export default AdminDashboardPage;
