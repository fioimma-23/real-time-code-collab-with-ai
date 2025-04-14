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

export default store;
