import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const bentoCategories = [
  {
    name: 'Electronics',
    title: 'Next-Gen Tech',
    subtitle: 'Headphones, smartwatches & keyboards',
    badge: 'Trending Now',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fashion',
    title: 'Footwear & Sneakers',
    subtitle: 'Performance runners & casual kicks',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Home',
    title: 'Artisan Home',
    subtitle: 'Pour-over sets & workspace decor',
    badge: 'Minimal Living',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sports',
    title: 'Sports & Fitness',
    subtitle: 'Laser-grip mats & active training',
    badge: 'High Energy',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
  },
];

const tickerItems = [
  'FREE EXPRESS DELIVERY NATIONWIDE ON ORDERS OVER RS. 2,000',
  'EXCLUSIVE 2026 SEASON COLLECTION NOW LIVE',
  '100% SECURE CASH ON DELIVERY & CARD PAYMENTS',
  '7-DAY HASSLE-FREE RETURN POLICY',
  'SAME-DAY DISPATCH FOR ORDERS BEFORE 3 PM',
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error } = useSelector((state) => state.products);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products by selected home tab
  const filteredProducts = items.filter((item) => {
    if (activeCategoryFilter === 'All') return true;
    return item.category?.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  const displayProducts = filteredProducts.slice(0, 4);

  return (
    <div className="home-wrapper" style={{ overflowX: 'hidden', backgroundColor: '#fdfbf9' }}>
      
      {/* Top Ticker Bar */}
      <div style={styles.ticker}>
        <div className="ticker-animated" style={styles.tickerInner}>
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} style={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      {/* Hero Section: Clean Luxury Editorial */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroGrid}>
          
          {/* Left Hero Content */}
          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e94560', display: 'inline-block' }}></span>
              <span>Spring / Summer Curated Collection 2026</span>
            </div>

            <h1 style={styles.heroHeading}>
              Premium Living.<br />
              <span style={styles.heroGradientText}>Elevated Style.</span>
            </h1>

            <p style={styles.heroSubtext}>
              Explore authentic audio, lifestyle apparel, and smart accessories engineered for performance, durability, and daily comfort.
            </p>

            <div style={styles.heroActions}>
              <Link to="/products" className="btn btn-primary" style={styles.btnPrimary}>
                <span>Explore Catalog</span>
                <span style={{ fontSize: '16px' }}>&rarr;</span>
              </Link>
              <Link to="/products?filter=deals" className="btn btn-outline" style={styles.btnOutline}>
                <span>Special Deals</span>
              </Link>
            </div>

            {/* Live Trust Metrics */}
            <div style={styles.metricsRow}>
              <div>
                <div style={styles.metricValue}>50K+</div>
                <div style={styles.metricLabel}>Products In Stock</div>
              </div>
              <div style={styles.metricDivider}></div>
              <div>
                <div style={styles.metricValue}>4.9 ★</div>
                <div style={styles.metricLabel}>Customer Rating</div>
              </div>
              <div style={styles.metricDivider}></div>
              <div>
                <div style={styles.metricValue}>100%</div>
                <div style={styles.metricLabel}>Authentic Guarantee</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Luxury Spotlight Card */}
          <div style={styles.heroRight}>
            <div 
              style={styles.spotlightCard}
              onClick={() => navigate('/products')}
              role="button"
              tabIndex={0}
            >
              <div style={styles.spotlightBadge}>
                FEATURED SPOTLIGHT • 15% OFF
              </div>

              <div style={styles.spotlightImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80"
                  alt="Sony WH-1000XM5"
                  style={styles.spotlightImg}
                />
              </div>

              <div style={styles.spotlightFooter}>
                <div>
                  <div style={styles.spotlightCategory}>Audio Leader</div>
                  <div style={styles.spotlightTitle}>Sony WH-1000XM5 ANC</div>
                  <div style={styles.spotlightSpecs}>Dual Processors • 30h Battery Life</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.spotlightOldPrice}>Rs. 9,999</div>
                  <div style={styles.spotlightPrice}>Rs. 8,499</div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </section>

      {/* Trust & Value Pillars */}
      <section style={styles.trustStrip}>
        <div className="container" style={styles.trustGrid}>
          <div style={styles.trustItem}>
            <div style={{ ...styles.trustIconWrap, background: '#fff1f2', color: '#e94560' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <div style={styles.trustItemTitle}>Free Express Delivery</div>
              <div style={styles.trustItemDesc}>On all orders over Rs. 2,000</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={{ ...styles.trustIconWrap, background: '#ecfdf5', color: '#059669' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <div>
              <div style={styles.trustItemTitle}>Cash on Delivery & Card</div>
              <div style={styles.trustItemDesc}>100% verified authentic checkout</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={{ ...styles.trustIconWrap, background: '#fef3c7', color: '#d97706' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
            <div>
              <div style={styles.trustItemTitle}>7-Day Free Returns</div>
              <div style={styles.trustItemDesc}>No questions asked policy</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={{ ...styles.trustIconWrap, background: '#eff6ff', color: '#2563eb' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <div style={styles.trustItemTitle}>24/7 Dedicated Support</div>
              <div style={styles.trustItemDesc}>Priority customer assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Bento Categories Showcase */}
      <section className="container" style={{ padding: '72px 20px' }}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionSubBadge}>EXPLORE DEPARTMENTS</span>
            <h2 style={styles.sectionHeading}>Curated Collections</h2>
          </div>
          <Link to="/products" style={styles.sectionLink}>
            <span>View All Categories</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div style={styles.bentoGrid}>
          {bentoCategories.map((cat) => (
            <div
              key={cat.name}
              style={styles.bentoCard}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              role="button"
              tabIndex={0}
            >
              <img src={cat.image} alt={cat.title} style={styles.bentoImg} />
              <div style={styles.bentoOverlay}></div>
              <div style={styles.bentoContent}>
                <span style={styles.bentoTag}>{cat.badge}</span>
                <h3 style={styles.bentoTitle}>{cat.title}</h3>
                <p style={styles.bentoDesc}>{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Catalog Showcase */}
      <section className="container" style={{ padding: '0 20px 72px' }}>
        <div style={styles.catalogHeaderRow}>
          <div>
            <span style={styles.sectionSubBadge}>HANDPICKED FOR YOU</span>
            <h2 style={styles.sectionHeading}>Featured Catalog</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
              Trending pieces and fresh arrivals curated for you
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div style={styles.filterPillsRow}>
            {['All', 'Electronics', 'Fashion', 'Sports'].map((tab) => {
              const active = activeCategoryFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategoryFilter(tab)}
                  style={{
                    ...styles.filterPill,
                    backgroundColor: active ? '#0f172a' : '#ffffff',
                    color: active ? '#ffffff' : '#475569',
                    borderColor: active ? '#0f172a' : '#e2e8f0',
                    boxShadow: active ? '0 2px 8px rgba(15, 23, 42, 0.2)' : 'none',
                  }}
                >
                  {tab === 'All' ? 'All Items' : tab}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : displayProducts.length > 0 ? (
          <div className="grid-4" style={{ gap: '24px' }}>
            {displayProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-mark">Store</div>
            <h3>No items in this filter</h3>
            <p>Try switching to another category or view all products.</p>
            <button className="btn btn-primary" onClick={() => setActiveCategoryFilter('All')}>
              Show All Products
            </button>
          </div>
        )}
      </section>

      {/* Mid-Page Editorial Promo Banner */}
      <section className="container" style={{ paddingBottom: '72px' }}>
        <div style={styles.promoBanner}>
          <div style={styles.promoGlow}></div>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
            <span style={styles.promoTag}>EXCLUSIVE MEMBER PERK</span>
            <h2 style={styles.promoTitle}>Get Flat 15% Off Your First Purchase</h2>
            <p style={styles.promoDesc}>
              Join thousands of smart shoppers across Pakistan. Create your account in seconds and unlock exclusive deals and free courier tracking.
            </p>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '700' }}>
                Create Free Account &rarr;
              </Link>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Use promo voucher at checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partner Strip */}
      <section style={styles.brandStrip}>
        <div className="container" style={styles.brandStripInner}>
          {['SONY', 'NIKE', 'APPLE', 'ADIDAS', 'SAMSUNG', 'ZARA', 'PUMA'].map((brand) => (
            <span key={brand} style={styles.brandName}>{brand}</span>
          ))}
        </div>
      </section>

    </div>
  );
};

const styles = {
  ticker: {
    background: '#0f172a',
    color: '#ffffff',
    padding: '10px 0',
    overflow: 'hidden',
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  tickerInner: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  tickerItem: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '0 32px',
    flexShrink: 0,
    letterSpacing: '0.8px',
    color: '#ff6b8b',
  },
  heroSection: {
    background: 'linear-gradient(180deg, #fdfbf9 0%, #f7f5f2 55%, #ffffff 100%)',
    padding: '70px 20px 80px',
    position: 'relative',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '48px',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '6px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
  },
  heroHeading: {
    fontSize: 'clamp(34px, 4.2vw, 56px)',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.14',
    letterSpacing: '-1px',
  },
  heroGradientText: {
    background: 'linear-gradient(135deg, #e94560 0%, #ff5376 50%, #ff7a59 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtext: {
    fontSize: '16px',
    color: '#475569',
    lineHeight: '1.65',
    margin: 0,
    maxWidth: '500px',
  },
  heroActions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    paddingTop: '6px',
  },
  btnPrimary: {
    padding: '13px 28px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnOutline: {
    padding: '13px 26px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  metricsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    maxWidth: '460px',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginTop: '6px',
  },
  metricDivider: {
    width: '1px',
    height: '28px',
    background: '#e2e8f0',
  },
  heroRight: {
    position: 'relative',
    maxWidth: '480px',
    margin: '0 auto',
    width: '100%',
  },
  spotlightCard: {
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.1)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  spotlightBadge: {
    display: 'inline-block',
    background: '#e94560',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '800',
    padding: '4px 12px',
    borderRadius: '999px',
    boxShadow: '0 2px 8px rgba(233, 69, 96, 0.35)',
    letterSpacing: '0.5px',
  },
  spotlightImgWrap: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px 0',
  },
  spotlightImg: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))',
    transition: 'transform 0.4s ease',
  },
  spotlightFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    background: '#ffffff',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
  },
  spotlightCategory: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#e94560',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  spotlightTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f172a',
    marginTop: '2px',
  },
  spotlightSpecs: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  spotlightOldPrice: {
    fontSize: '12px',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  spotlightPrice: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
  },
  floatingPillLeft: {
    position: 'absolute',
    bottom: '-16px',
    left: '-16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: '16px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.1)',
  },
  floatingIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: '#ecfdf5',
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  floatingPillRight: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(226, 232, 240, 0.9)',
    borderRadius: '999px',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
  },
  trustStrip: {
    background: '#ffffff',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #e2e8f0',
    padding: '28px 20px',
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    alignItems: 'center',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  trustIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  trustItemTitle: {
    fontWeight: '800',
    fontSize: '13px',
    color: '#0f172a',
  },
  trustItemDesc: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  sectionSubBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#e94560',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '4px 0 0',
    letterSpacing: '-0.5px',
  },
  sectionLink: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#e94560',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  bentoCard: {
    position: 'relative',
    height: '270px',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  bentoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bentoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.85) 100%)',
  },
  bentoContent: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    right: '20px',
    color: '#ffffff',
  },
  bentoTag: {
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#fecdd3',
    letterSpacing: '0.6px',
  },
  bentoTitle: {
    fontSize: '18px',
    fontWeight: '800',
    margin: '2px 0',
    color: '#ffffff',
  },
  bentoDesc: {
    fontSize: '12px',
    color: '#cbd5e1',
    margin: 0,
  },
  catalogHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterPillsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterPill: {
    padding: '8px 18px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '700',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  promoBanner: {
    position: 'relative',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: '24px',
    padding: '48px 36px',
    color: '#ffffff',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
  },
  promoGlow: {
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '280px',
    height: '280px',
    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.35) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  promoTag: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#e94560',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  },
  promoTitle: {
    fontSize: 'clamp(24px, 3.5vw, 36px)',
    fontWeight: '800',
    margin: '0 0 12px',
    lineHeight: '1.2',
  },
  promoDesc: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  brandStrip: {
    background: '#ffffff',
    padding: '36px 20px',
    borderTop: '1px solid #e2e8f0',
  },
  brandStripInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.45,
    filter: 'grayscale(1)',
    flexWrap: 'wrap',
    gap: '24px',
  },
  brandName: {
    fontWeight: '800',
    fontSize: '18px',
    letterSpacing: '3px',
    color: '#334155',
  },
};

export default HomePage;
