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
      const itemId = (item.id || item._id)?.toString();
      const existItem = state.cartItems.find(
        (x) => (x.id || x._id)?.toString() === itemId
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          (x.id || x._id)?.toString() === itemId
            ? {
                ...x,
                ...item,
                id: itemId,
                qty: Math.min(x.qty + (item.qty || 1), Number(item.stock) || 99),
              }
            : x
        );
      } else {
        state.cartItems.push({
          ...item,
          id: itemId,
          qty: Math.min(item.qty || 1, Number(item.stock) || 99),
        });
      }

      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    removeFromCart: (state, action) => {
      const idToRemove = action.payload?.toString();
      state.cartItems = state.cartItems.filter(
        (x) => (x.id || x._id)?.toString() !== idToRemove
      );

      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const idStr = id?.toString();
      const item = state.cartItems.find(
        (x) => (x.id || x._id)?.toString() === idStr
      );
      if (item) {
        item.qty = Math.max(1, Math.min(qty, Number(item.stock) || 99));
      }

      // Update totals and SAVE to localStorage
      state.totalPrice = state.cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalPrice', JSON.stringify(state.totalPrice));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('totalPrice');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
