import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';

// --- THUNKS ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category = '', sort = '', search = '', filter = '', page = 1 } = {}, { getState, rejectWithValue }) => {
    try {
      // Pull token from auth slice
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const params = new URLSearchParams({ page, limit: 8 });
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);
      if (filter) params.append('filter', filter);

      const { data } = await axios.get(`${BASE_URL}?${params.toString()}`, config);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get(`${BASE_URL}/${id}`, config);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProductReview = createAsyncThunk(
  'products/createReview',
  async ({ id, reviewData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState(); 
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${BASE_URL}/${id}/reviews`, reviewData, config);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);


export const deleteProductReview = createAsyncThunk(
  'products/deleteReview',
  async ({ productId, reviewId }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = { 
        headers: { Authorization: `Bearer ${userInfo.token}` } 
      };
      await axios.delete(`${BASE_URL}/${productId}/reviews/${reviewId}`, config);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
    }
  }
);

// --- SLICE ---

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null,
    page: 1,
    totalPages: 1,
    total: 0,
    filters: { category: '', sort: '' },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; 
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || action.payload || [];
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

// --- EXPORTS ---

// Named exports for your components (fixes the setFilters error)
export const { setFilters, setPage } = productSlice.actions;

// Default export for your store.js (fixes the default export error)
export default productSlice.reducer;
