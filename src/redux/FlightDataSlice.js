// flightDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const flightDataSlice = createSlice({
  name: "flight",
  initialState: {
    flightData: null,
  },
  reducers: {
    setFlightData: (state, action) => {
      state.flightData = action.payload;
    },
  },
});

export const { setFlightData } = flightDataSlice.actions;
export const selectFlightData = (state) => state.flight.flightData;
export default flightDataSlice.reducer;
