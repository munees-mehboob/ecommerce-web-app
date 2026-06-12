import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice'; 
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice'; 

export const store = configureStore({
  reducer: {
     auth: authReducer,
    products: productReducer,
     cart: cartReducer,
     orders: orderReducer,
       wishlist: wishlistReducer, 
  },
});

export default store;