import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import ConfirmModal from '../components/ConfirmModal';
import { clearWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems = [] } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleAddAllToCart = () => {
    if (!userInfo) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }

    const availableItems = wishlistItems.filter((item) => (item.stock || 0) > 0);
    if (availableItems.length === 0) {
      toast.error('No items in your wishlist are currently in stock');
      return;
    }

    availableItems.forEach((item) => {
      dispatch(
        addToCart({
          id: (item.id || item._id)?.toString(),
          title: item.title,
          image: item.image,
          price: item.price,
          stock: item.stock,
          qty: 1,
        })
      );
    });

    toast.success(`Added ${availableItems.length} item(s) to cart!`);
    navigate('/cart');
  };

  const handleConfirmClearWishlist = () => {
    dispatch(clearWishlist());
    setIsConfirmOpen(false);
    toast.success('Wishlist cleared');
  };

  return (
    <div className="container page" style={{ minHeight: '70vh', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>My Wishlist</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            {wishlistItems.length} saved product{wishlistItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Add All to Cart
            </button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '30px' }}>
          <div className="empty-state-mark">Wishlist</div>
          <h3>Your wishlist is empty</h3>
          <p>Save products you like with the heart icon and they will appear here.</p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '14px' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid-4" style={{ marginTop: '20px' }}>
          {wishlistItems.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}

      {/* In-App Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Clear Wishlist"
        message="Are you sure you want to remove all saved items from your wishlist? This cannot be undone."
        confirmText="Yes, Clear All"
        confirmColor="#e94560"
        onConfirm={handleConfirmClearWishlist}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default WishlistPage;
