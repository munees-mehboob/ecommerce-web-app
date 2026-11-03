import { Link } from 'react-router-dom';

const BrandLogo = ({
  size = 'md',
  showText = true,
  to = '/',
  textColor = '#ffffff',
  className = '',
}) => {
  const dimensions = {
    sm: { img: 28, font: '16px' },
    md: { img: 38, font: '22px' },
    lg: { img: 52, font: '26px' },
    xl: { img: 72, font: '30px' },
  }[size] || { img: 38, font: '22px' };

  const content = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      <img
        src="/logo.jpg"
        alt="ShopNow Logo"
        style={{
          width: `${dimensions.img}px`,
          height: `${dimensions.img}px`,
          borderRadius: size === 'xl' || size === 'lg' ? '14px' : '9px',
          objectFit: 'cover',
          boxShadow: '0 3px 12px rgba(233, 69, 96, 0.35)',
          display: 'block',
        }}
      />
      {showText && (
        <span
          style={{
            fontSize: dimensions.font,
            fontWeight: '800',
            letterSpacing: '-0.5px',
            color: textColor,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Shop<span style={{ color: '#e94560', marginLeft: '2px' }}>Now</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
