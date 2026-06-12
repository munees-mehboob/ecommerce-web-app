import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, setPage } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const CATEGORIES = ['', 'Electronics', 'Fashion', 'Footwear', 'Home', 'Sports', 'Fitness', 'Beauty', 'Books', 'Toys', 'Grocery', 'Accessories', 'Kitchen'];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('category') || '';
  const searchFromUrl   = searchParams.get('search')   || '';
  const filterFromUrl   = searchParams.get('filter')   || '';

  const {
    items = [],
    loading = false,
    error = null,
    page = 1,
    totalPages = 1,
    filters = { category: '', sort: '' },
  } = useSelector((state) => state.products || {});

  // ── Single useEffect — merges everything into ONE fetch call ──
// Inside ProductsPage.jsx

useEffect(() => {
  dispatch(fetchProducts({
    category: categoryFromUrl || filters.category,
    sort:     filters.sort,
    search:   searchFromUrl,
    filter:   filterFromUrl, // <--- MAKE SURE THIS IS HERE
    page,
  }));
}, [categoryFromUrl, searchFromUrl, filterFromUrl, filters.category, filters.sort, page, dispatch]);


  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));

    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = filterFromUrl === 'deals'
    ? '🔥 Special Offers & Deals'
    : searchFromUrl
      ? `Results for "${searchFromUrl}"`
      : categoryFromUrl
        ? categoryFromUrl
        : 'All Products';

  return (
    <div className="container page">

      <h1 className="section-title" style={{ marginBottom: '8px' }}>
  {pageTitle}
</h1>

<p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
  {/* If it's the deals page, make the count stand out a bit */}
  {filterFromUrl === 'deals' ? (
    <span>
      Found <strong style={{ color: '#e94560' }}>{items.length}</strong> incredible bargains for you
    </span>
  ) : (
    `${items.length} product${items.length !== 1 ? 's' : ''} found`
  )}
</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <select
          value={categoryFromUrl || filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          style={selectStyle}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          style={selectStyle}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear filters button — only shows when filters active */}
        {(categoryFromUrl || searchFromUrl || filterFromUrl || filters.sort) && (
          <button
            onClick={() => {
              dispatch(setFilters({ category: '', sort: '' }));
              setSearchParams({});
            }}
            style={{
              padding: '10px 18px', borderRadius: '8px',
              border: '1.5px solid #e94560', color: '#e94560',
              background: '#fff', cursor: 'pointer',
              fontSize: '14px', fontWeight: '500',
            }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#e94560', fontSize: '15px' }}>
          ❌ {error}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#222', marginBottom: '8px' }}>
            No products found
          </h3>
          <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
            {searchFromUrl
              ? `No results for "${searchFromUrl}"`
              : `No products in "${categoryFromUrl || 'this category'}"`}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch(setFilters({ category: '', sort: '' }));
              setSearchParams({});
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-4">
            {items.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

const selectStyle = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  background: '#fff',
  cursor: 'pointer',
  outline: 'none',
  fontSize: '14px',
  color: '#333',
};

export default ProductsPage;