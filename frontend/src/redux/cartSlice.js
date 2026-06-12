import { createSlice } from '@reduxjs/toolkit';

// 1. HELPER: Load cart from localStorage if it exists
const savedCart = localStorage.getItem('cartItems') 
  ? JSON.parse(localStorage.getItem('cartItems')) 
  : [];

const savedTotal = localStorage.getItem('totalPrice') 
  ? JSON.parse(localStorage.getItem('totalPrice')) 
  : 0;

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: savedCart, // Load saved items
    totalPrice: savedTotal, // Load saved total
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? { ...item, qty: x.qty + item.qty } : x
        );
      } else {
        state.cartItems.push(item);
      }
      
      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
      
      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x.id === id);
      if (item) {
        item.qty = qty;
      }
      
      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('totalPrice');
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
