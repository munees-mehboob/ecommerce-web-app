import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, createProductReview, deleteProductReview } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

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

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  // FIX: Added guard for userInfo to prevent "Cannot read properties of undefined"
  useEffect(() => {
    if (product?.reviews && userInfo?._id) {
      const existingReview = product.reviews.find(
        (r) => r.user?.toString() === userInfo._id.toString()
      );
      if (existingReview) {
        setUserRating(existingReview.rating);
        setComment(existingReview.comment);
      }
    }
  }, [product, userInfo]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      stock: product.stock,
      qty: quantity
    }));
    toast.success(`${product.title} added to cart!`, {
    icon: '🛒',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
    duration: 3000,
  });
  
    toast.success('Added to cart! 🛒');
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error('Please login to write a review');
    if (userRating === 0) return toast.error('Please select a star rating');

    try {
      await dispatch(createProductReview({
        id,
        reviewData: { rating: userRating, comment }
      })).unwrap();
      
      toast.success('Review saved! ✨');
      dispatch(fetchProductById(id)); 
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm('Delete your review?')) {
      try {
        await dispatch(deleteProductReview({ productId: id, reviewId })).unwrap();
        toast.success('Review deleted');
        setUserRating(0);
        setComment('');
        dispatch(fetchProductById(id));
      } catch (err) {
        toast.error(err || 'Delete failed');
      }
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= Math.ceil(rating) ? '#f59e0b' : '#ccc' }}>★</span>
    ));
  };

  const qtyBtnStyle = { padding: '10px 15px', background: '#eee', border: 'none', cursor: 'pointer', fontWeight: 'bold' };

  if (loading) return <div className="container page"><Loader /></div>;
  if (error) return <div className="container page text-center"><p>❌ {error}</p></div>;
  if (!product) return null;

  // FIX: Safe check using optional chaining
  const hasReviewed = product.reviews?.some(r => r.user?.toString() === userInfo?._id?.toString());

  return (
    <div className="container page">
      <nav style={{ margin: '20px 0', fontSize: '14px', color: '#888' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span> / 
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}> Products</span> / 
        <span style={{ color: 'var(--primary)', fontWeight: '600' }}> {product.title}</span>
      </nav>

      <div className="grid-2" style={{ gap: '60px', alignItems: 'start' }}>
        <div style={{ position: 'relative' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '20px', background: '#f8f8f8', boxShadow: 'var(--shadow)' }} />
          {product.stock === 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', borderRadius: '20px' }}>OUT OF STOCK</div>
          )}
        </div>

        <div className="detail-info">
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '20px' }}>{renderStars(product.rating)}</div>
            <span style={{ fontWeight: '600' }}>{Number(product.rating).toFixed(1)} / 5</span>
            <span style={{ color: '#888' }}>({product.reviews?.length || 0} reviews)</span>
          </div>
          <h2 style={{ fontSize: '36px', color: 'var(--primary)', fontWeight: '800', marginBottom: '20px' }}>Rs. {Number(product.price).toLocaleString()}</h2>
          
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={qtyBtnStyle}>−</button>
                <span style={{ padding: '0 20px', lineHeight: '40px', fontWeight: '800' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={qtyBtnStyle}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1, padding: '15px' }} onClick={handleAddToCart}>🛒 Add to Cart</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: activeTab === tab ? 'var(--primary)' : '#888', borderBottom: activeTab === tab ? '3px solid var(--primary)' : 'none' }}>
              {tab.toUpperCase()} {tab === 'reviews' && `(${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <p style={{ maxWidth: '800px', lineHeight: '1.8' }}>{product.description}</p>
        ) : (
          <div style={{ maxWidth: '700px' }}>
            {/* Review Form */}
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '15px', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
              <h3>{hasReviewed ? 'Edit Your Review' : 'Write a Review'}</h3>
              <form onSubmit={submitReviewHandler}>
                <div style={{ margin: '20px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setUserRating(star)} style={{ fontSize: '32px', cursor: 'pointer', color: star <= userRating ? '#f59e0b' : '#cbd5e1', marginRight: '5px' }}>★</span>
                  ))}
                </div>
                <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you think?" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }} />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{hasReviewed ? 'Update Review' : 'Submit Review'}</button>
              </form>
            </div>

            {/* Review List */}
            {product.reviews?.map((rev) => (
              <div key={rev._id} style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{rev.name}</strong>
                  {userInfo?._id === rev.user && (
                    <button onClick={() => deleteReviewHandler(rev._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  )}
                </div>
                <div>{renderStars(rev.rating)}</div>
                <p>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
