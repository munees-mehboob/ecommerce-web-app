import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">

        <div>
          <div className="footer-logo">🛒 ShopNow</div>
          <p className="footer-desc">Your one-stop shop for everything you need, delivered fast.</p>
        </div>

        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Account</h4>
          <div className="footer-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/profile">Profile</Link>
            
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 ShopNow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;