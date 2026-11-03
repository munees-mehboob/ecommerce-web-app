import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../redux/orderSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.orders || {});

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    confirmColor: '#e94560',
    onConfirm: () => {},
  });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const deliverHandler = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Dispatch Order',
      message: 'Confirm that this order has been packed and handed over to the courier?',
      confirmText: 'Yes, Mark Delivered',
      confirmColor: '#3b82f6',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.put(`/orders/${id}/deliver`);
          toast.success('Order status updated to Delivered');
          dispatch(fetchAllOrders());
        } catch {
          toast.error('Delivery update failed');
        }
      },
    });
  };

  const payHandler = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Record Payment',
      message: 'Confirm that payment has been received in full for this order?',
      confirmText: 'Yes, Confirm Payment',
      confirmColor: '#10b981',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.put(`/orders/${id}/pay`);
          toast.success('Payment recorded successfully');
          dispatch(fetchAllOrders());
        } catch (err) {
          toast.error(err.response?.data?.message || 'Payment update failed');
        }
      },
    });
  };

  if (loading) return <Loader />;

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.isPaid).length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
          Orders & Fulfillment CRM
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          Manage payments, customer shipping details, and order dispatches.
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={styles.statPill}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>Total Orders:</span>
          <strong style={{ color: '#0f172a', fontSize: '15px' }}>{totalOrders}</strong>
        </div>
        <div style={styles.statPill}>
          <span style={{ color: '#166534', fontSize: '13px' }}>Paid:</span>
          <strong style={{ color: '#166534', fontSize: '15px' }}>{paidOrders}</strong>
        </div>
        <div style={styles.statPill}>
          <span style={{ color: '#991b1b', fontSize: '13px' }}>Unpaid:</span>
          <strong style={{ color: '#991b1b', fontSize: '15px' }}>{totalOrders - paidOrders}</strong>
        </div>
        <div style={styles.statPill}>
          <span style={{ color: '#1e40af', fontSize: '13px' }}>Delivered:</span>
          <strong style={{ color: '#1e40af', fontSize: '15px' }}>{deliveredOrders}</strong>
        </div>
      </div>

      {/* Orders Table Card */}
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
          <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={styles.th}>ORDER ID</th>
                <th style={styles.th}>CUSTOMER</th>
                <th style={styles.th}>DESTINATION</th>
                <th style={styles.th}>TOTAL</th>
                <th style={styles.th}>PAYMENT STATUS</th>
                <th style={styles.th}>DELIVERY STATUS</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const orderId = order.id || order._id;
                  const customerName = order.user?.name || order.User?.name || 'Customer';
                  const customerEmail = order.user?.email || '';

                  return (
                    <tr key={orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
                        #{String(orderId).slice(-6).toUpperCase()}
                      </td>

                      <td style={styles.td}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{customerName}</div>
                        {customerEmail && <div style={{ fontSize: '12px', color: '#64748b' }}>{customerEmail}</div>}
                      </td>

                      <td style={styles.td}>
                        <div style={{ fontSize: '13px', color: '#334155' }}>{order.shippingAddress}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {order.city}, {order.postalCode}
                        </div>
                        {order.phone && (
                          <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600', marginTop: '2px' }}>
                            Phone: {order.phone}
                          </div>
                        )}
                      </td>

                      <td style={{ ...styles.td, fontWeight: '800', color: '#e94560' }}>
                        Rs. {Number(order.totalPrice || 0).toLocaleString()}
                      </td>

                      <td style={styles.td}>
                        {order.isPaid ? (
                          <div>
                            <span style={styles.badgeSuccess}>Paid</span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                              {order.paymentMethod || 'Card'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span style={styles.badgeDanger}>Unpaid</span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                              {order.paymentMethod || 'Cash on Delivery'}
                            </div>
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {order.isDelivered ? (
                          <div>
                            <span style={styles.badgeBlue}>Delivered</span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                              {order.deliveredAt?.substring(0, 10)}
                            </div>
                          </div>
                        ) : (
                          <span style={styles.badgePending}>Processing</span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!order.isPaid && (
                            <button
                              onClick={() => payHandler(orderId)}
                              style={styles.btnActionBlue}
                            >
                              Mark Paid
                            </button>
                          )}
                          {!order.isDelivered && (
                            <button
                              onClick={() => deliverHandler(orderId)}
                              style={styles.btnActionRed}
                            >
                              Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmColor={confirmConfig.confirmColor}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

const styles = {
  statPill: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '8px 16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  th: {
    padding: '14px 16px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    verticalAlign: 'middle',
  },
  badgeSuccess: {
    background: '#dcfce7',
    color: '#166534',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
  },
  badgeDanger: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
  },
  badgeBlue: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
  },
  badgePending: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
  },
  btnActionBlue: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnActionRed: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AdminOrdersPage;
