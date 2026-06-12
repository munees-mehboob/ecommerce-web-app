import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../redux/orderSlice'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders || {});
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Handler to mark order as delivered/shipped
  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as shipped?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config);
        toast.success('Order status updated! 📦');
        dispatch(fetchAllOrders()); 
      } catch (err) {
        toast.error('Update failed');
      }
    }
  };

  // Handler to mark order as paid
  const payHandler = async (id) => {
    if (window.confirm('Mark this order as paid?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/pay`, {}, config);
        toast.success('Payment recorded! 💰');
        dispatch(fetchAllOrders()); 
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment update failed');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container page">
      <h1 className="section-title" style={{ marginBottom: '30px' }}>Order Management</h1>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>USER</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>PAYMENT</th>
              <th style={styles.th}>DELIVERY</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
         <tbody>
  {[...orders].reverse().map((order) => (
    <tr key={order.id} style={styles.tr}>
      <td style={{ ...styles.td, fontWeight: '700' }}>#{order.id}</td>
      <td style={styles.td}>{order.User?.name || 'Guest'}</td>
      
      <td style={{ ...styles.td, fontWeight: '700', color: 'var(--primary)' }}>
        Rs. {Number(order.totalPrice).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
      </td>

      <td style={styles.td}>
        {order.isPaid ? (
          <div style={styles.statusGroup}>
             <span style={styles.badgeSuccess}>Paid</span>
             <small style={styles.dateLabel}>{order.paidAt?.substring(0, 10)}</small>
          </div>
        ) : (
          <span style={styles.badgeDanger}>Unpaid</span>
        )}
      </td>

    <td style={styles.td}>
  <div style={styles.statusContainer}>
    {order.isDelivered ? (
      <>
        <span style={styles.badgeSuccess}>Delivered</span>
        <small style={styles.dateLabel}>{order.deliveredAt?.substring(0, 10)}</small>
      </>
    ) : (
      <>
        <span style={styles.badgePending}>Processing</span>
        {/* This "ghost" label keeps the badge pushed up to the right spot */}
        <small style={{ ...styles.dateLabel, visibility: 'hidden' }}>0000-00-00</small>
      </>
    )}
  </div>
</td>


      <td style={styles.td}>
        <div style={styles.actionCell}>
          {/* Slot for Mark Paid */}
          <div style={styles.buttonSlot}>
            {!order.isPaid && (
              <button onClick={() => payHandler(order.id)} style={styles.btnBlue}>
                Mark Paid
              </button>
            )}
          </div>

          {/* Slot for Ship Order */}
          <div style={styles.buttonSlot}>
            {!order.isDelivered && (
              <button onClick={() => deliverHandler(order.id)} style={styles.btnRed}>
                Ship Order
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

// --- STYLING ---
const styles = {
  tableCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  theadRow: { background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' },
  th: { padding: '20px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' },
  tr: { borderBottom: '1px solid #f1f5f9' },
   td: { padding: '20px', fontSize: '14px', color: 'var(--text-main)', verticalAlign: 'middle' },
    statusGroup: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  

  actionCell: { display: 'flex', gap: '8px', alignItems: 'center' },
  buttonSlot: { width: '90px', display: 'flex', justifyContent: 'center' }, // Keeps buttons aligned in columns

 btnBlue: { 
    width: '100%', padding: '8px 0', fontSize: '11px', fontWeight: '600',
    background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' 
  },

  btnRed: { 
    width: '100%', padding: '8px 0', fontSize: '11px', fontWeight: '600',
    background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' 
  },

  badgeSuccess: { background: '#dcfce7', color: '#15803d', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  badgeDanger: { background: '#fee2e2', color: '#b91c1c', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  badgePending: { background: '#fef3c7', color: '#92400e', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  btnActionSmall: { 
    padding: '6px 12px', 
    fontSize: '12px', 
    background: '#3b82f6', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: '600'
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centers the badge and date
    justifyContent: 'center',
    height: '45px', 
  },

  statusCell: { 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', // Keeps badges centered vertically
    alignItems: 'flex-start', 
    minHeight: '50px' // Ensures row height stays the same with or without a date
  },
  dateLabel: { 
    fontSize: '10px', 
    color: '#aaa', 
    marginTop: '2px',
    display: 'block',
    lineHeight: '1'
  },
  relativeContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  }
};

export default AdminOrdersPage;
