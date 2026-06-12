import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  // 1. Grab wishlistItems from the 'wishlist' state you defined in store.js
  const { wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className="container page" style={{ minHeight: '70vh', padding: '40px 20px' }}>
      {/* 2. Dynamic Title: If this shows a number like (1), the connection is working! */}
      <h1 className="section-title">My Wishlist ({wishlistItems.length})</h1>

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>❤️</div>
          <h3>Your wishlist is empty</h3>
          <p style={{ color: '#888', margin: '20px 0 30px' }}>Tap the heart on any product to save it here!</p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto' }}>
            Go Shopping
          </Link>
        </div>
      ) : (
        /* 3. The Grid: This loop actually draws the products from your Redux store */
        <div className="grid-4" style={{ marginTop: '30px' }}>
          {wishlistItems.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
