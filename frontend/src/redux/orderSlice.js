import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Inside frontend/src/redux/orderSlice.js

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // FIX: Change '/mine' to '/myorders' to match your backend route!
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);


export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      // Note the URL is /api/orders (gets everyone's orders)
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);



// Inside your orderSlice.js

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      /* --- Admin: Fetch All Orders --- */
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; 
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- User: Fetch MY Orders (ADD THESE MISSING CASES) --- */
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        // This is the line that actually puts your Rs. orders into the table!
        state.orders = action.payload; 
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;

