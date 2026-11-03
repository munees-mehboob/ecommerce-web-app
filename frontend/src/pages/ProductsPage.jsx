import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, setPage } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const CATEGORY_CHIPS = [
  { value: '', label: 'All Catalog' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Home', label: 'Home & Living' },
  { value: 'Sports', label: 'Sports & Fitness' },
  { value: 'Beauty', label: 'Beauty & Care' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Grocery', label: 'Groceries' },
  { value: 'Books', label: 'Books & Stationery' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Featured / Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Customer Rated' },
  { value: 'newest', label: 'Newest Releases' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('category') || '';
  const searchFromUrl = searchParams.get('search') || '';
  const filterFromUrl = searchParams.get('filter') || '';

  const {
    items = [],
    loading = false,
    error = null,
    page = 1,
    totalPages = 1,
    filters = { category: '', sort: '' },
  } = useSelector((state) => state.products || {});

  const currentCategory = categoryFromUrl || filters.category;

  useEffect(() => {
    dispatch(fetchProducts({
      category: currentCategory,
      sort: filters.sort,
      search: searchFromUrl,
      filter: filterFromUrl,
      page,
    }));
  }, [currentCategory, searchFromUrl, filterFromUrl, filters.sort, page, dispatch]);

  const handleCategorySelect = (val) => {
    dispatch(setFilters({ category: val }));
    dispatch(setPage(1));

    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('category', val);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const handleSortChange = (val) => {
    dispatch(setFilters({ sort: val }));
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('sort', val);
    else newParams.delete('sort');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    dispatch(setFilters({ category: '', sort: '' }));
    dispatch(setPage(1));
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = filterFromUrl === 'deals'
    ? 'Special Offers & Deals'
    : searchFromUrl
      ? `Results for "${searchFromUrl}"`
      : currentCategory ? `${currentCategory} Collection` : 'All Products';

  return (
    <div className="container page" style={{ minHeight: '80vh' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#e94560', letterSpacing: '1px', textTransform: 'uppercase' }}>
            STORE CATALOG
          </span>
          <h1 className="section-title" style={{ margin: '4px 0 6px', fontSize: '30px' }}>{pageTitle}</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {filterFromUrl === 'deals' ? (
              <span>Found <strong style={{ color: '#e94560' }}>{items.length}</strong> special discount deals</span>
            ) : (
              `Showing ${items.length} curated product${items.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {(categoryFromUrl || searchFromUrl || filterFromUrl || filters.sort) && (
          <button
            className="btn btn-outline"
            onClick={clearFilters}
            type="button"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Modern Category Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '12px', marginBottom: '20px' }}>
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = currentCategory === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleCategorySelect(chip.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: isActive ? 'var(--primary-gradient)' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                border: isActive ? 'none' : '1px solid #e2e8f0',
                boxShadow: isActive ? '0 4px 14px rgba(233, 69, 96, 0.35)' : '0 1px 3px rgba(0,0,0,0.04)',
                transform: isActive ? 'scale(1.02)' : 'none',
              }}
            >
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Options Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Sort by:</span>
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '13px',
              fontWeight: '600',
              color: '#0f172a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton" style={{ height: '360px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error" style={{ textAlign: 'center', padding: '24px', borderRadius: '12px' }}>
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '30px' }}>
          <div className="empty-state-mark">Search</div>
          <h3>No matching products</h3>
          <p>
            {searchFromUrl
              ? `No products found matching "${searchFromUrl}". Try searching with broader keywords.`
              : `No products in this category yet.`}
          </p>
          <button className="btn btn-primary" onClick={clearFilters} type="button" style={{ marginTop: '12px' }}>
            Show All Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid-4" style={{ gap: '24px' }}>
            {items.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
