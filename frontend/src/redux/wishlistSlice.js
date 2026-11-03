import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      // This line handles ANY type of ID (MySQL or MongoDB style)
      const productId = product.id || product._id;
      
      const existItem = state.wishlistItems.find(
        (x) => (x.id || x._id) === productId
      );

      if (existItem) {
        state.wishlistItems = state.wishlistItems.filter(
          (x) => (x.id || x._id) !== productId
        );
      } else {
        state.wishlistItems.push(product);
      }
      
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      const idToRemove = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (x) => (x.id || x._id) !== idToRemove
      );
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem('wishlistItems');
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
