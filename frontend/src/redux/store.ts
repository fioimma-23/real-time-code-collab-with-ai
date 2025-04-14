<<<<<<< HEAD
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice";
import projectReducer from "./Slices/projectSlice";
import roomReducer from "./Slices/roomSlice";
import fileReducer from "./Slices/fileSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    room: roomReducer,
    file: fileReducer, 
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

=======
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

>>>>>>> 27d893c273197c0b1b6793ede69092144f8721f6
export default store;
