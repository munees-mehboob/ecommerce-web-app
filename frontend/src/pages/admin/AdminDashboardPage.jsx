import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import Loader from '../../components/Loader';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await axios.get(
          'http://localhost:5000/api/orders/stats',
          config
        );

        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };

    fetchStats();
  }, [userInfo]);

  if (!data) return <Loader />;

  return (
    <div className="container page">

      {/* Header */}
      <header style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Admin Dashboard
        </h1>

        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, {userInfo.name}. Here is what's happening today.
        </p>
      </header>

      {/* Stats Cards */}
      <div
        className="grid-3"
        style={{
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Total Revenue
          </p>

          <h2 style={styles.statValue}>
            Rs. {data.stats.totalEarnings.toLocaleString()}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Total Orders
          </p>

          <h2 style={styles.statValue}>
            {data.stats.totalOrders}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Active Users
          </p>

          <h2 style={styles.statValue}>
            {data.stats.totalUsers}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="grid-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}
      >

        {/* Chart Section */}
        <div
          style={{
            ...styles.chartWrapper,
            minWidth: 0
          }}
        >
          <h3
            style={{
              marginBottom: '25px',
              fontWeight: '700'
            }}
          >
            Revenue Trend
          </h3>

          <ResponsiveContainer
            width="99%"
            height={400}
          >
            <AreaChart
              data={data.chartData || []}
            >
              <defs>
                <linearGradient
                  id="colorRev"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.1}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: '#888'
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: '#888'
                }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: 'var(--shadow)'
                }}
                formatter={(val) =>
                  `Rs. ${val.toLocaleString()}`
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <h3
            style={{
              fontWeight: '700',
              marginBottom: '10px'
            }}
          >
            Quick Actions
          </h3>

          <Link
            to="/admin/orders"
            style={styles.actionLink}
          >
            📦 Manage Orders
          </Link>

          <Link
            to="/admin/products"
            style={styles.actionLink}
          >
            🛍️ Edit Inventory
          </Link>

          <Link
            to="/admin/users"
            style={styles.actionLink}
          >
            👥 Customer List
          </Link>
        </div>

      </div>
    </div>
  );
};

const styles = {
  statCard: {
    background: '#fff',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
  },

  statLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },

  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--primary)',
  },

  chartWrapper: {
    background: '#fff',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow)',
  },

  actionLink: {
    display: 'block',
    padding: '18px',
    background: '#fff',
    color: 'var(--text-main)',
    textDecoration: 'none',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    fontWeight: '600',
    transition: '0.2s',
    boxShadow: 'var(--shadow)',
  },
};

export default AdminDashboardPage;