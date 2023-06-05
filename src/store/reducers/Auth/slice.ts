import { createSlice } from "@reduxjs/toolkit";
import { AuthUserInfo } from "../../../types/auth";

interface AuthState {
  isAuthenticated: boolean;
  registerSuccess: boolean;
  error: null | string;
  data: { user: AuthUserInfo | null; access: string; refresh: string };
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  registerSuccess: false,
  data: {
    user: null,
    access: localStorage.getItem("access") || "",
    refresh: localStorage.getItem("refresh") || "",
  },
  error: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action) {
      state.isAuthenticated = true;
      state.data.user = action.payload.user;
      state.data.refresh = action.payload.refresh;
      state.data.access = action.payload.access;
      state.isLoading = false;
    },
    authFailed(state, action) {
      console.log(action.payload);
      state.error = action.payload.data.message;
      state.isLoading = false;
    },
    authFetch(state) {
      state.isLoading = true;
      state.data.user = null;
    },
  },
  extraReducers: {},
});

export default authSlice.reducer;
