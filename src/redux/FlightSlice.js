// In your Redux slice file (e.g., flightSlice.js)
import { createSlice } from "@reduxjs/toolkit";

const flightSlice = createSlice({
  name: "flightdatalist",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
        const flightIdToRemove = action.payload;
        state.cart = state.cart.filter(item => item.flight_id !== flightIdToRemove);
      },
    editCartItem: (state, action) => {
      const { id, updatedItem } = action.payload;
      const index = state.cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.cart[index] = updatedItem;
      }
    },
  },
});

export const { addToCart,removeFromCart, editCartItem } = flightSlice.actions;
export default flightSlice.reducer;
export const selectCartItems = state => state.flightdatalist.cart;