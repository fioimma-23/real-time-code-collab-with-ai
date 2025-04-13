// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import the reducers from respective slice files
import authReducer from "./Slices/authSlice"; // path to authSlice
import projectReducer from "./Slices/projectSlice"; // path to projectSlice
import roomReducer from "./Slices/roomSlice"; // path to roomSlice

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // auth slice reducer
    project: projectReducer, // project slice reducer
    room: roomReducer, // room slice reducer
  },
});

export default store;
