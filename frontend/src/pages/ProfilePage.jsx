import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/orderSlice';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="profile-container" style={{ padding: '2rem' }}>
      <h1>My Purchase History</h1>
      {loading ? <Loader /> : error ? <p>❌ {error}</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>ORDER ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>
    <tbody>
  {orders?.length > 0 ? (
    orders.map((order) => (
      <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px' }}>{order.id}</td>
        <td>{order.createdAt?.substring(0, 10)}</td>
        <td>Rs.{Number(order.totalPrice).toFixed(2)}</td>
        <td>{order.isPaid ? '✅' : '❌'}</td>
        <td>{order.isDelivered ? '✅' : '❌'}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
        No orders found. <a href="/products">Start shopping!</a>
      </td>
    </tr>
  )}
</tbody>

        </table>
      )}
    </div>
  );
};

export default ProfilePage;
