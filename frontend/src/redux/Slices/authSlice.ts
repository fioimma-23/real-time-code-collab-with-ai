// src/redux/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

const initialState: AuthState = {
  username: "",
  displayName: "",
  password: "",
  confirmPassword: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthField: (state, action: PayloadAction<{ field: keyof AuthState; value: string }>) => {
      state[action.payload.field] = action.payload.value;
    },
    resetAuth: () => initialState,
  },
});

export const { setAuthField, resetAuth } = authSlice.actions;
export default authSlice.reducer;
