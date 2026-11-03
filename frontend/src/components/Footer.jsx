import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('You have subscribed to ShopNow VIP deals!');
    setEmail('');
  };

  return (
    <footer className="footer" style={styles.footer}>
      {/* Top Newsletter / Perks Banner */}
      <div style={styles.newsletterSection}>
        <div className="container" style={styles.newsletterContainer}>
          <div>
            <span style={styles.newsletterBadge}>STAY IN THE LOOP</span>
            <h3 style={styles.newsletterHeading}>Subscribe for VIP Drops & Exclusive 15% Off</h3>
            <p style={styles.newsletterSubtext}>
              Be the first to hear about seasonal sales, new arrivals, and member flash coupons.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.newsletterInput}
              required
            />
            <button type="submit" style={styles.newsletterBtn}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="container" style={styles.mainGrid}>
        {/* Column 1: Brand Info */}
        <div style={styles.colBrand}>
          <div style={{ marginBottom: '16px' }}>
            <BrandLogo size="md" textColor="#ffffff" to="/" />
          </div>
          <p style={styles.brandDesc}>
            Your premier destination for verified authentic lifestyle, electronics, footwear, and home essentials. Fast nationwide courier delivery.
          </p>
        </div>

        {/* Column 2: Shop Collections */}
        <div>
          <h4 style={styles.columnHeading}>Shop Collections</h4>
          <div style={styles.linksList}>
            <Link to="/products?category=Electronics" style={styles.footerLink}>Electronics & Audio</Link>
            <Link to="/products?category=Fashion" style={styles.footerLink}>Fashion & Footwear</Link>
            <Link to="/products?category=Home" style={styles.footerLink}>Home & Lifestyle</Link>
            <Link to="/products?category=Sports" style={styles.footerLink}>Sports & Fitness</Link>
            <Link to="/products?filter=deals" style={styles.footerLinkHighlight}>Flash Deals & Discounts</Link>
          </div>
        </div>

        {/* Column 3: Customer Care */}
        <div>
          <h4 style={styles.columnHeading}>Customer Care</h4>
          <div style={styles.linksList}>
            <Link to="/orders/history" style={styles.footerLink}>Track Order & Invoices</Link>
            <Link to="/cart" style={styles.footerLink}>Shopping Cart</Link>
            <Link to="/wishlist" style={styles.footerLink}>Saved Wishlist</Link>
            <Link to="/profile" style={styles.footerLink}>Account Dashboard</Link>
            <Link to="/products" style={styles.footerLink}>Browse All Products</Link>
          </div>
        </div>

        {/* Column 4: Trust & Verified Payments */}
        <div>
          <h4 style={styles.columnHeading}>100% Safe Shopping</h4>
          <p style={{ ...styles.brandDesc, fontSize: '13px', marginBottom: '14px' }}>
            Every order is protected by end-to-end encryption with transparent cash on delivery and card verification.
          </p>

          {/* Payment Method Badges */}
          <div style={styles.paymentBadgesGrid}>
            <div style={styles.paymentBadge}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span>Cash on Delivery</span>
            </div>
            <div style={styles.paymentBadge}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span>Visa / MasterCard</span>
            </div>
            <div style={styles.paymentBadge}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div style={styles.paymentBadge}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span>7-Day Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomContainer}>
          <div style={styles.copyrightText}>
            &copy; 2026 <strong>ShopNow Inc.</strong> All rights reserved.
          </div>
          <div style={styles.badgeStrip}>
            <span style={styles.miniPill}>Verified Authentic</span>
            <span style={styles.miniPill}>Express Courier</span>
            <span style={styles.miniPill}>Safe Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#090d16',
    color: '#94a3b8',
    borderTop: '1px solid #1e293b',
    position: 'relative',
    overflow: 'hidden',
  },
  newsletterSection: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'linear-gradient(180deg, rgba(233, 69, 96, 0.08) 0%, transparent 100%)',
    padding: '44px 20px',
  },
  newsletterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  newsletterBadge: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#e94560',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  newsletterHeading: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '800',
    margin: '4px 0 6px',
    letterSpacing: '-0.3px',
  },
  newsletterSubtext: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0,
    maxWidth: '480px',
  },
  newsletterForm: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    maxWidth: '420px',
  },
  newsletterInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  },
  newsletterBtn: {
    padding: '12px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ff4d6d 0%, #e94560 100%)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 14px rgba(233, 69, 96, 0.35)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '44px',
    padding: '56px 20px 48px',
  },
  colBrand: {
    maxWidth: '340px',
  },
  brandDesc: {
    fontSize: '13.5px',
    lineHeight: '1.7',
    color: '#94a3b8',
    margin: '0 0 20px',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '12.5px',
    color: '#cbd5e1',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  contactIcon: {
    fontSize: '14px',
  },
  columnHeading: {
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '800',
    marginBottom: '18px',
    letterSpacing: '0.2px',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLink: {
    color: '#94a3b8',
    fontSize: '13.5px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  footerLinkHighlight: {
    color: '#ff6b8b',
    fontSize: '13.5px',
    fontWeight: '700',
    textDecoration: 'none',
  },
  policyText: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    fontStyle: 'italic',
  },
  paymentBadgesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  paymentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    padding: '8px 12px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#cbd5e1',
  },
  bottomBar: {
    borderTop: '1px solid #1e293b',
    padding: '20px 0',
    background: '#070a12',
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '12.5px',
    color: '#64748b',
  },
  copyrightText: {
    color: '#64748b',
  },
  badgeStrip: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  miniPill: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '999px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    color: '#94a3b8',
    fontWeight: '600',
  },
};

export default Footer;
