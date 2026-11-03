import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/orderSlice';
import Loader from '../components/Loader';

const OrdersHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <div className="history-container" style={{ padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto', minHeight: '75vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>My Purchase History</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            Track your orders, view delivery status, and print receipts
          </p>
        </div>
        <Link to="/products" className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 16px' }}>
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="empty-state-mark">Orders</div>
          <h3>No orders placed yet</h3>
          <p>Once you purchase items from ShopNow, your order details and receipts will be stored here.</p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '16px' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="orders-desktop-table" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ORDER ID</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>ITEMS</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>DATE</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>TOTAL</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>PAYMENT</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>DELIVERY</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#64748b', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const items = order.orderItems || order.items || [];
                  const orderId = order.id || order._id;
                  return (
                    <tr key={orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        #{String(orderId).slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {items.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              {item.image && (
                                <img src={item.image} alt="" style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }} />
                              )}
                              {item.title} ({item.qty}x)
                            </span>
                          ))}
                          {items.length > 2 && (
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                              +{items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: '#e94560', fontSize: '14px' }}>
                        Rs. {Number(order.totalPrice).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: order.isPaid ? '#dcfce7' : '#fef3c7',
                            color: order.isPaid ? '#15803d' : '#b45309',
                            display: 'inline-block',
                          }}
                        >
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          {order.paymentMethod || 'COD'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: order.isDelivered ? '#dbeafe' : '#f1f5f9',
                            color: order.isDelivered ? '#1e40af' : '#475569',
                            display: 'inline-block',
                          }}
                        >
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#0f172a',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Printable Receipt Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="receipt-modal-content"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '18px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.jpg" alt="ShopNow" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>ShopNow Order Receipt</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Official Customer Invoice</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: '700',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* Order Info & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedOrder.isPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', border: selectedOrder.isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: '700', color: selectedOrder.isPaid ? '#047857' : '#b45309', fontSize: '13px' }}>
                  {selectedOrder.isPaid ? 'Payment Verified' : 'Cash on Delivery'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  #{String(selectedOrder.id || selectedOrder._id).slice(-8).toUpperCase()} • {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  {selectedOrder.transactionId && ` • Ref: ${selectedOrder.transactionId}`}
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Rs. {Number(selectedOrder.totalPrice).toLocaleString()}
              </div>
            </div>

            {/* Delivery Details */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>CUSTOMER</span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', marginTop: '4px' }}>{selectedOrder.user?.name || userInfo?.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedOrder.user?.email || userInfo?.email}</div>
                {selectedOrder.phone && <div style={{ fontSize: '12px', color: '#64748b' }}>Phone: {selectedOrder.phone}</div>}
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>SHIPPING DESTINATION</span>
                <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px', marginTop: '4px' }}>{selectedOrder.shippingAddress || 'Standard Address'}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedOrder.city}, {selectedOrder.postalCode}</div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Order Items</h4>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                {(selectedOrder.orderItems || selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderBottom: idx !== (selectedOrder.orderItems || []).length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.image && (
                        <img src={item.image} alt={item.title} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.qty} × Rs. {Number(item.price).toLocaleString()}</div>
                      </div>
                    </div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                      Rs. {(item.qty * item.price).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn btn-primary"
                style={{ padding: '9px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersHistoryPage;
