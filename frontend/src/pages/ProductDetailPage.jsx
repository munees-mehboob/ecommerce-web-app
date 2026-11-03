import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchProductById, createProductReview, deleteProductReview } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct: product, selectedLoading: loading, selectedError: error } = useSelector(
    (state) => state.products
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  const handleAddToCart = (goToCart = false) => {
    if (!userInfo) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({
      id: product.id || product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: quantity,
    }));

    toast.success(`${product.title} added to cart`);
    if (goToCart) {
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (!userInfo) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/checkout');
      return;
    }
    dispatch(addToCart({
      id: product.id || product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: quantity,
    }));
    navigate('/checkout');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Please login to write a review');
    if (userRating === 0) return toast.error('Please select a star rating');

    try {
      await dispatch(createProductReview({
        id,
        reviewData: { rating: userRating, comment },
      })).unwrap();

      toast.success('Review saved');
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      await dispatch(deleteProductReview({ productId: id, reviewId: reviewToDelete })).unwrap();
      toast.success('Review removed');
      setUserRating(0);
      setComment('');
      setReviewToDelete(null);
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err || 'Delete failed');
    }
  };

  const renderStars = (rating = 0) => (
    [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= Math.ceil(rating) ? '#f59e0b' : '#ccc' }}>&#9733;</span>
    ))
  );

  const qtyBtnStyle = {
    padding: '10px 15px',
    background: '#eee',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page"><div className="alert alert-error">{error}</div></div>;
  if (!product) return null;

  const currentUserId = userInfo?._id || userInfo?.id;
  const hasReviewed = product.reviews?.some(
    (review) => (review.user?._id || review.user)?.toString() === currentUserId?.toString()
  );
  const existingReview = product.reviews?.find(
    (review) => (review.user?._id || review.user)?.toString() === currentUserId?.toString()
  );

  const startEditingReview = () => {
    if (!existingReview) return;
    setUserRating(existingReview.rating);
    setComment(existingReview.comment);
  };

  return (
    <div className="container page">
      <nav style={{ margin: '20px 0', fontSize: '14px', color: '#888' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        {' / '}
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Products</span>
        {' / '}
        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{product.title}</span>
      </nav>

      <div className="grid-2" style={{ gap: 'clamp(24px, 4vw, 60px)', alignItems: 'start' }}>
        <div style={{ position: 'relative' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '20px', background: '#f8f8f8', boxShadow: 'var(--shadow)' }} />
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', borderRadius: '20px' }}>
              OUT OF STOCK
            </div>
          )}
        </div>

        <div className="detail-info">
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: '800', marginBottom: '10px', lineHeight: 1.2 }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '20px' }}>{renderStars(product.rating)}</div>
            <span style={{ fontWeight: '600' }}>{Number(product.rating || 0).toFixed(1)} / 5</span>
            <span style={{ color: '#888' }}>({product.reviews?.length || 0} reviews)</span>
          </div>

          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#0f172a', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Rs. {Number(product.price).toLocaleString()}
          </h2>

          {product.stock > 0 && product.stock <= 3 && (
            <div
              style={{
                color: '#e11d48',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Only {product.stock} items left in stock — order soon!
            </div>
          )}

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                <button type="button" onClick={() => setQuantity((qty) => Math.max(1, qty - 1))} style={qtyBtnStyle}>-</button>
                <span style={{ padding: '0 20px', lineHeight: '42px', fontWeight: '800' }}>{quantity}</span>
                <button type="button" onClick={() => setQuantity((qty) => Math.min(product.stock, qty + 1))} style={qtyBtnStyle}>+</button>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '12px 20px', fontWeight: '700' }}
                onClick={() => handleAddToCart(false)}
              >
                Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, minWidth: '150px', padding: '12px 24px', fontWeight: '700' }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
          {['description', 'reviews'].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                color: activeTab === tab ? 'var(--primary)' : '#888',
                borderBottom: activeTab === tab ? '3px solid var(--primary)' : 'none',
              }}
            >
              {tab.toUpperCase()} {tab === 'reviews' && `(${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <p style={{ maxWidth: '800px', lineHeight: '1.8' }}>{product.description}</p>
        ) : (
          <div style={{ maxWidth: '700px' }}>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '15px', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <h3>{hasReviewed ? 'Edit Your Review' : 'Write a Review'}</h3>
                {hasReviewed && (
                  <button type="button" className="btn btn-outline" onClick={startEditingReview} style={{ padding: '6px 12px', fontSize: '13px' }}>
                    Load My Review
                  </button>
                )}
              </div>
              <form onSubmit={submitReviewHandler}>
                <div style={{ margin: '20px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      style={{ fontSize: '32px', cursor: 'pointer', color: star <= userRating ? '#f59e0b' : '#cbd5e1', marginRight: '5px', background: 'none' }}
                      aria-label={`${star} star rating`}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
                <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you think?" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }} />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{hasReviewed ? 'Update Review' : 'Submit Review'}</button>
              </form>
            </div>

            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div key={review._id} style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{review.name}</strong>
                    {((review.user?._id || review.user)?.toString() === currentUserId?.toString() || userInfo?.isAdmin) && (
                      <button
                        type="button"
                        onClick={() => setReviewToDelete(review._id || review.id)}
                        style={{ color: '#e11d48', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div>{renderStars(review.rating)}</div>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#888' }}>No reviews yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal for Delete Review */}
      <ConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Review"
        message="Are you sure you want to remove your review? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmColor="#e11d48"
        onConfirm={confirmDeleteReview}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
};

export default ProductDetailPage;
