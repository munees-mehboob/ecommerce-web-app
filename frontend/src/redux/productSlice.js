import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// --- THUNKS ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category = '', sort = '', search = '', filter = '', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);
      if (filter) params.append('filter', filter);

      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProductReview = createAsyncThunk(
  'products/createReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/products/${id}/reviews`, reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  'products/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
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
    selectedLoading: false,
    selectedError: null,
    page: 1,
    totalPages: 1,
    totalCount: 0,
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
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload;
      });
  },
});

export const { setFilters, setPage } = productSlice.actions;

export default productSlice.reducer;
