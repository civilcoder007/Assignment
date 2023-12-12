import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice"
import flightReducer from "./FlightDataSlice"
import flightDataReducer from "./FlightSlice"

export const Store = configureStore({
    reducer:{
        auth: authReducer,
        flight:flightReducer,
        flightdatalist: flightDataReducer
    }
})