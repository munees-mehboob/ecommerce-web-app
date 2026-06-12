import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    description: '',
    discount: 0,
    isNewArrival: true,
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '14px',
    color: '#1e293b',
    background: '#fff',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '4px',
    display: 'block',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const editClickHandler = (product) => {
    setEditMode(true);
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      discount: product.discount || 0,
      stock: product.stock,
      description: product.description,
      isNewArrival: product.isNewArrival,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addClickHandler = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({
      title: '', price: '', image: '', category: '',
      stock: '', description: '', discount: 0, isNewArrival: true,
    });
    setShowForm(!showForm);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discount: Number(formData.discount) || 0,
    };

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editMode) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, submissionData, config);
        toast.success('Product Updated! ✨');
      } else {
        await axios.post('http://localhost:5000/api/products', submissionData, config);
        toast.success('Product Added! 🚀');
      }
      setShowForm(false);
      dispatch(fetchProducts());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        toast.success('Product deleted');
        dispatch(fetchProducts());
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Manage Products</h1>
        <button
          onClick={addClickHandler}
          style={{
            background: showForm && !editMode ? '#e11d48' : '#4f46e5',
            color: 'white', padding: '10px 20px',
            borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}
        >
          {showForm && !editMode ? '✕ Cancel' : '+ Add New Product'}
        </button>
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <form
          onSubmit={submitHandler}
          style={{
            background: '#f8fafc', padding: '24px',
            borderRadius: '12px', marginBottom: '32px',
            display: 'grid', gap: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Form Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
              {editMode ? `✏️ Editing Product #${editingId}` : '➕ Create New Product'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                border: 'none', background: '#fee2e2',
                color: '#e11d48', padding: '6px 14px',
                borderRadius: '6px', cursor: 'pointer',
                fontWeight: '600', fontSize: '13px',
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Title */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Product Title</label>
            <input
              type="text"
              placeholder="e.g. Wireless Headphones"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          {/* Price / Discount / Stock — 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Price (Rs.)</label>
              <input
                type="number"
                placeholder="e.g. 4999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Discount (%)</label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                min="0"
                max="100"
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Stock Quantity</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Image URL + Preview */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              style={inputStyle}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                onError={(e) => e.target.style.display = 'none'}
                style={{
                  width: '80px', height: '80px',
                  objectFit: 'cover', borderRadius: '8px',
                  border: '1px solid #e2e8f0', marginTop: '6px',
                }}
              />
            )}
          </div>

          {/* Category dropdown */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={inputStyle}
            >
              <option value="">Select a category...</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Footwear</option>
              <option>Sports</option>
              <option>Fitness</option>
              <option>Kitchen</option>
              <option>Home</option>
              <option>Beauty</option>
              <option>Accessories</option>
              <option>Books</option>
              <option>Toys</option>
              <option>Grocery</option>
            </select>
          </div>

          {/* Description */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Describe the product..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
            />
          </div>

          {/* New Arrival checkbox */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', padding: '12px 16px',
            borderRadius: '8px', border: '1px solid #e2e8f0',
          }}>
            <input
              type="checkbox"
              id="isNewArrival"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
            <label htmlFor="isNewArrival" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>
              Show in "New Arrivals" on Home Page
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            style={{
              background: editMode ? '#3b82f6' : '#10b981',
              color: 'white', padding: '13px',
              border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontWeight: '700', fontSize: '15px',
            }}
          >
            {editMode ? '💾 Update Product' : '🚀 Save New Product'}
          </button>
        </form>
      )}

      {/* ── PRODUCTS TABLE ── */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['ID', 'Image', 'Name', 'Price', 'Discount (%)', 'Stock', 'Category', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                  No products found. Add your first product above.
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>
                  #{product.id}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&h=60&fit=crop'}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                  />
                </td>

                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1e293b', maxWidth: '180px' }}>
                  {product.title}
                </td>

                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0f766e' }}>
                  Rs. {Number(product.price).toLocaleString()}
                </td>

                {/* Inline discount edit */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      defaultValue={product.discount || 0}
                      min="0"
                      max="100"
                      onBlur={async (e) => {
                        const newDiscount = Number(e.target.value);
                        try {
                          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                          await axios.put(`http://localhost:5000/api/products/${product.id}`, { ...product, discount: newDiscount }, config);
                          toast.success('Discount updated!');
                          dispatch(fetchProducts());
                        } catch (err) {
                          toast.error('Failed to update discount');
                        }
                      }}
                      style={{
                        width: '64px', padding: '6px 8px',
                        borderRadius: '6px', border: '1px solid #cbd5e1',
                        fontSize: '13px', fontWeight: '600', color: '#e11d48',
                        textAlign: 'center',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>%</span>
                  </div>
                </td>

                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#475569' }}>
                  <span style={{
                    background: product.stock === 0 ? '#fee2e2' : product.stock < 10 ? '#fef9c3' : '#dcfce7',
                    color: product.stock === 0 ? '#b91c1c' : product.stock < 10 ? '#a16207' : '#15803d',
                    padding: '3px 10px', borderRadius: '99px',
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                  </span>
                </td>

                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                  {product.category}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => editClickHandler(product)}
                      style={{
                        background: '#eff6ff', color: '#3b82f6',
                        border: '1px solid #bfdbfe',
                        padding: '6px 14px', borderRadius: '6px',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(product.id)}
                      style={{
                        background: '#fff1f2', color: '#e11d48',
                        border: '1px solid #fecdd3',
                        padding: '6px 14px', borderRadius: '6px',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminProductsPage;
