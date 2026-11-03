import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist } from '../redux/wishlistSlice';

const Rating = ({ value, text }) => (
  <div className="rating" style={{ marginBottom: '8px' }} aria-label={`${value || 0} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= Math.ceil(value || 0) ? '#f59e0b' : '#ccc' }}>
        &#9733;
      </span>
    ))}
    <span style={{ color: '#888', marginLeft: '5px', fontSize: '12px' }}>{text}</span>
  </div>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    id,
    _id,
    title = 'Untitled product',
    price = 0,
    image,
    stock = 0,
    rating = 0,
    numReviews = 0,
    discount = 0,
  } = product;

  const productId = id || _id;
  const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;

  const { userInfo } = useSelector((state) => state.auth);
  const isWishlisted = useSelector((state) =>
    state.wishlist.wishlistItems.some((x) => (x.id || x._id) === productId)
  );

  const onAddToCart = (e) => {
    e.stopPropagation();
    if (!userInfo) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ id: productId, title, price, image, stock, qty: 1 }));
    toast.success(`${title} added to cart`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!userInfo) {
      toast.error('Please login to save items to your wishlist');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${productId}`)}
      style={{ cursor: 'pointer', position: 'relative' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/products/${productId}`);
      }}
    >
      <div className="product-image-wrapper" style={{ position: 'relative' }}>
        <img src={image} alt={title} className="product-image" />

        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discount > 0 && <span style={styles.discountBadge}>{discount}% OFF</span>}
          {stock > 0 && stock <= 3 && (
            <span style={styles.stockBadge}>Only {stock} left!</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          style={{
            ...styles.wishlistBtn,
            background: isWishlisted ? '#fff1f2' : '#ffffff',
            borderColor: isWishlisted ? '#fecdd3' : '#e2e8f0',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
        >
          {isWishlisted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e94560" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          )}
        </button>

        {stock === 0 && <div style={styles.outOfStockOverlay}>OUT OF STOCK</div>}
      </div>

      <div className="product-info">
        <h3 className="product-title" style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{title}</h3>
        <Rating value={rating} text={`(${numReviews || 0})`} />

        <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {discount > 0 && (
              <span style={styles.oldPrice}>Rs. {originalPrice.toLocaleString()}</span>
            )}
            <span className="product-price" style={{ color: '#0f172a', fontWeight: '800', fontSize: '18px' }}>
              Rs. {Number(price).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            onClick={onAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Sold Out' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  discountBadge: {
    background: '#ef4444',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '800',
    width: 'fit-content',
    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
  },
  stockBadge: {
    background: '#fff1f2',
    color: '#e11d48',
    border: '1px solid #fecdd3',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    width: 'fit-content',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  oldPrice: {
    textDecoration: 'line-through',
    color: '#999',
    fontSize: '12px',
    marginBottom: '0px',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '999px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
    fontSize: '15px',
    zIndex: 2,
    transition: 'all 0.2s ease',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#333',
  },
};

export default ProductCard;
