import { useDispatch, useSelector } from 'react-redux'; 
import { addToCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../redux/wishlistSlice'; 
import toast from 'react-hot-toast'; // 1. Import toast

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id, _id, title, price, image, stock, rating, numReviews, discount } = product;

  // Calculate the original price before the discount
  const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : price;

  const isWishlisted = useSelector((state) => 
    state.wishlist.wishlistItems.some((x) => x.id === (id || _id))
  );

  // 2. Updated Add to Cart with Toast
  const onAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ id: id || _id, title, price, image, stock, qty: 1 }));
    
    toast.success(`${title} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  // 3. Updated Wishlist with Toast
  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    
    if (!isWishlisted) {
      toast('Added to Wishlist', { icon: '❤️' });
    } else {
      toast('Removed from Wishlist', { icon: '💔' });
    }
  };

  const Rating = ({ value, text }) => {
    return (
      <div className="rating" style={{ marginBottom: '8px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: star <= Math.ceil(value) ? '#f59e0b' : '#ccc' }}>
             ★
          </span>
        ))}
        <span style={{ color: '#888', marginLeft: '5px', fontSize: '12px' }}>{text}</span>
      </div>
    );
  };

  return (
    <div 
      className="product-card" 
      onClick={() => navigate(`/products/${id || _id}`)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="product-image-wrapper" style={{ position: 'relative' }}>
        <img src={image} alt={title} className="product-image" />
        
        {discount > 0 && (
          <span style={styles.discountBadge}>
            {discount}% OFF
          </span>
        )}

        <button 
          onClick={handleWishlist} 
          style={styles.heartBtn}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {stock === 0 && (
          <div style={styles.outOfStockOverlay}>
            OUT OF STOCK
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title" style={{ fontWeight: '700', fontSize: '16px' }}>{title}</h3>
        <Rating value={rating} text={`(${numReviews || 0})`} />

        <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {discount > 0 && (
              <span style={styles.oldPrice}>
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="product-price" style={{ color: '#4f46e5', fontWeight: '800', fontSize: '18px' }}>
              Rs. {Number(price).toLocaleString()}
            </span>
          </div>

          <button 
            className="add-to-cart-btn" 
            onClick={onAddToCart} 
            disabled={stock === 0}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              backgroundColor: stock === 0 ? '#ccc' : '#4f46e5',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: stock === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {stock === 0 ? '🚫' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  discountBadge: {
    position: 'absolute', top: '10px', left: '10px',
    background: '#ef4444', color: '#fff', padding: '4px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '800', zIndex: 2,
  },
  oldPrice: {
    textDecoration: 'line-through', color: '#999', fontSize: '12px', marginBottom: '0px'
  },
  heartBtn: {
    position: 'absolute', top: '10px', right: '10px', 
    background: '#fff', border: 'none', borderRadius: '50%', 
    width: '32px', height: '32px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '16px', zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  outOfStockOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: '#333'
  }
};

export default ProductCard;
