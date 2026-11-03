import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container page">
      <div className="empty-state" style={{ marginTop: '40px' }}>
        <div className="empty-state-mark">404</div>
        <h1 className="section-title">Page not found</h1>
        <p>The page you are looking for does not exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
