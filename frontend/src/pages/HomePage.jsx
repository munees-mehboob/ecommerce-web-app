import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.products);
  
  // State to handle professional hover interactions since inline styles don't support :hover
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle filtering safely
  const arrivalsToShow = items ? items.filter(item => item.isNewArrival === true || item.isNewArrival === 1) : [];

  const categories = [
    { name: 'Electronics', icon: '💻' }, { name: 'Fashion', icon: '👗' },
    { name: 'Home', icon: '🏠' }, { name: 'Sports', icon: '⚽' },
    { name: 'Beauty', icon: '💄' }, { name: 'Books', icon: '📚' },
    { name: 'Toys', icon: '🧸' }, { name: 'Grocery', icon: '🛒' },
    { name: 'Accessories', icon: '👜' } 
  ];

  const handleCategoryClick = (name) => {
    navigate(`/products?category=${name}`);
  };

  return (
    <div className="home-wrapper" style={{ overflowX: 'hidden', backgroundColor: '#f9f9fb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ── 1. TOP ANNOUNCEMENT TICKER ── */}
      <div style={styles.ticker}>
        <div className="ticker-animated" style={styles.tickerInner}>
          {['FREE DELIVERY ON ORDERS OVER RS. 2000', 'FLASH SALE: 60% OFF', 'NEW ARRIVALS IN STOCK', '30-DAY EASY RETURNS'].map((t, i) => (
            <span key={i} style={styles.tickerItem}>{t}</span>
          ))}
          {/* Loop Duplicate for seamless UI scroll */}
          {['FREE DELIVERY ON ORDERS OVER RS. 2000', 'FLASH SALE: 60% OFF', 'NEW ARRIVALS IN STOCK', '30-DAY EASY RETURNS'].map((t, i) => (
            <span key={i + 10} style={styles.tickerItem}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── 2. PREMIUM HERO SECTION ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner} className="container">
          <div style={styles.heroLeft}>
            <span style={styles.heroTag}>✨ New Season 2026</span>
            <h1 style={styles.heroH1}>Shop Smarter,<br /><span style={{ color: '#e94560' }}>Live Better</span></h1>
            <p style={styles.heroSub}>Thousands of premium products. Unbeatable prices.<br />Fast delivery across Pakistan.</p>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
              <Link 
                to="/products" 
                className="btn btn-primary" 
                onMouseEnter={() => setHoveredBtn('shop')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  ...styles.btnPrimary,
                  transform: hoveredBtn === 'shop' ? 'translateY(-2px)' : 'none',
                  boxShadow: hoveredBtn === 'shop' ? '0 8px 20px rgba(233, 69, 96, 0.4)' : 'none'
                }}
              >
                Shop Now →
              </Link>
              <Link 
               to="/products?filter=deals" 
                className="btn btn-outline" 
                onMouseEnter={() => setHoveredBtn('deals')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  ...styles.btnOutline,
                  backgroundColor: hoveredBtn === 'deals' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  transform: hoveredBtn === 'deals' ? 'translateY(-2px)' : 'none'
                }}
              >
                View Deals
              </Link>
            </div>

            {/* Premium Minimalist Stats Grid */}
            <div style={styles.statsRow}>
              {[{ val: '50K+', lbl: 'Products Available' }, { val: '120K+', lbl: 'Happy Customers' }, { val: '4.8★', lbl: 'Store Rating' }].map(s => (
                <div key={s.lbl} style={styles.statBox}>
                  <div style={styles.statVal}>{s.val}</div>
                  <div style={styles.statLbl}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mosaic Aesthetic Hero Images Grid */}
          <div style={styles.heroImages}>
            <div style={{ gridRow: 'span 2', height: '100%' }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80" alt="Hero Featured" style={styles.imgFluidMain} />
            </div>
            <div style={{ height: '190px' }}>
              <img src="https://images.unsplash.com/photo-1733503747506-773e56e4078f?w=400&auto=format&fit=crop&q=80" alt="Hero Item Trend" style={styles.imgFluidSub} />
            </div>
            <div style={{ height: '190px' }}>
              <img src="https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=400&auto=format&fit=crop&q=80" alt="Hero Pack Delivery" style={styles.imgFluidSub} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BROWSE CATEGORIES ── */}
      <section className="container" style={{ padding: '90px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={styles.sectionTitle}>Browse Categories</h2>
          <p style={styles.sectionSubtitle}>Find exactly what you need in seconds</p>
          <div style={styles.titleUnderline}></div>
        </div>
        
        <div style={styles.categoryGrid}>
          {categories.map(cat => (
            <div 
              key={cat.name} 
              onClick={() => handleCategoryClick(cat.name)}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                ...styles.categoryCard,
                ...(hoveredCategory === cat.name ? styles.categoryCardHover : {})
              }}
            >
              <div style={{ 
                ...styles.categoryIcon, 
                transform: hoveredCategory === cat.name ? 'scale(1.15)' : 'scale(1)' 
              }}>
                {cat.icon}
              </div>
              <div style={styles.categoryName}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. DYNAMIC NEW ARRIVALS ── */}
      <section className="container" style={{ paddingBottom: '100px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={styles.sectionHeaderRow}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#11142d', margin: 0, letterSpacing: '-0.5px' }}>New Arrivals</h2>
            <p style={{ color: '#777', margin: '6px 0 0 0', fontSize: '14px' }}>Freshly added items tailored to your lifestyle</p>
          </div>
          <Link to="/products" style={styles.viewAllLink} className="view-all-hover">
            View All Products <span style={{ marginLeft: '4px' }}>→</span>
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div style={styles.errorAlert} className="alert alert-error">{error}</div>
        ) : (
          <div style={styles.productGrid} className="grid-4">
            {arrivalsToShow.length > 0 ? (
              arrivalsToShow.slice(0, 4).map(product => (
                <div key={product.id} style={styles.productCardWrapper}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div style={styles.emptyGridContainer}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <h3 style={{ color: '#1a1a2e', margin: '0 0 8px 0', fontWeight: '700' }}>No New Arrivals Featured</h3>
                <p style={{ color: '#888', margin: 0, fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  Check back soon! Go to the Admin Panel to feature premium collections here.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 5. PREMIUM TRUST BRAND STRIP ── */}
      <section style={styles.brandStrip}>
        <div className="container" style={styles.brandStripInner}>
          {['SAMSUNG', 'NIKE', 'APPLE', 'ADIDAS', 'SONY', 'H&M', 'ZARA'].map(brand => (
            <span key={brand} style={styles.brandName}>{brand}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- MODERN PREMIUM UI STYLING OBJECT ---
const styles = {
  ticker: { 
    background: '#111', 
    color: '#fff', 
    padding: '14px 0', 
    overflow: 'hidden', 
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  tickerInner: {
    display: 'flex',
    whiteSpace: 'nowrap'
  },
  tickerItem: { 
    fontSize: '12px', 
    fontWeight: '600', 
    padding: '0 40px', 
    flexShrink: 0, 
    letterSpacing: '1.5px',
    color: '#e94560'
  },
  hero: { 
    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)', 
    padding: '100px 20px', 
    color: '#fff',
    position: 'relative'
  },
  heroInner: { 
    display: 'grid', 
    gridTemplateColumns: '1.1fr 0.9fr', 
    gap: '60px', 
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column'
  },
  heroTag: { 
    alignSelf: 'flex-start',
    background: 'rgba(233, 69, 96, 0.15)', 
    color: '#e94560', 
    padding: '6px 14px', 
    borderRadius: '50px', 
    fontSize: '13px', 
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '20px'
  },
  heroH1: { 
    fontSize: '56px', 
    fontWeight: '800', 
    margin: '0 0 20px 0', 
    lineHeight: '1.15',
    letterSpacing: '-1px'
  },
  heroSub: { 
    fontSize: '18px', 
    color: '#b5b5c6', 
    marginBottom: '35px', 
    lineHeight: '1.6',
    fontWeight: '400'
  },
  btnPrimary: {
    background: '#e94560',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'all 0.25s ease',
    display: 'inline-block'
  },
  btnOutline: {
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'all 0.25s ease',
    display: 'inline-block'
  },
  statsRow: { 
    display: 'flex', 
    gap: '48px', 
    flexWrap: 'wrap',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '35px'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  statVal: { 
    fontSize: '32px', 
    fontWeight: '800', 
    color: '#fff',
    lineHeight: '1'
  },
  statLbl: { 
    fontSize: '12px', 
    color: '#8a8aa3', 
    textTransform: 'uppercase', 
    letterSpacing: '1px',
    marginTop: '8px',
    fontWeight: '600'
  },
  heroImages: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '16px',
    alignItems: 'center'
  },
  imgFluidMain: { 
    width: '100%', 
    height: '400px', 
    objectFit: 'cover', 
    borderRadius: '12px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
  },
  imgFluidSub: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    borderRadius: '12px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
  },
  sectionTitle: { 
    fontSize: '36px', 
    fontWeight: '800', 
    color: '#11142d', 
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  sectionSubtitle: { 
    color: '#777', 
    margin: '0 0 16px 0',
    fontSize: '16px'
  },
  titleUnderline: {
    width: '50px',
    height: '3px',
    background: '#e94560',
    margin: '0 auto',
    borderRadius: '2px'
  },
  categoryGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  categoryCard: { 
    background: '#fff', 
    padding: '24px 16px', 
    borderRadius: '14px', 
    textAlign: 'center', 
    border: '1px solid #eaeaea', 
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
  },
  categoryCardHover: {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
    borderColor: '#e94560'
  },
  categoryIcon: { 
    fontSize: '32px', 
    marginBottom: '14px',
    transition: 'transform 0.3s ease',
    display: 'inline-block'
  },
  categoryName: { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#2d3142' 
  },
  sectionHeaderRow: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: '35px',
    maxWidth: '1200px',
    margin: '0 auto 35px auto'
  },
  viewAllLink: { 
    color: '#e94560', 
    fontWeight: '700', 
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'opacity 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  productGrid: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  productCardWrapper: {
    transition: 'transform 0.3s ease',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  emptyGridContainer: { 
    gridColumn: 'span 4', 
    textAlign: 'center', 
    padding: '50px 20px', 
    background: '#fff', 
    borderRadius: '16px', 
    border: '2px dashed #e2e2e9' 
  },
  errorAlert: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px',
    borderRadius: '8px'
  },
  brandStrip: { 
    background: '#fff', 
    padding: '50px 20px', 
    borderTop: '1px solid #edeef2' 
  },
  brandStripInner: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    opacity: 0.4, 
    filter: 'grayscale(1)', 
    flexWrap: 'wrap', 
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  brandName: { 
    fontWeight: '800', 
    fontSize: '20px', 
    letterSpacing: '3px',
    color: '#333'
  }
};

export default HomePage;