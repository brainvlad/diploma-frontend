import {User} from "../../../types/user";
import {createSlice} from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    registerSuccess: boolean;
    error: null | string;
    data: { user: User; access: string; refresh: string };
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    registerSuccess: false,
    data: {
        user: JSON.parse(localStorage.getItem("userData") || "null"),
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
            state.error = action.payload.message;
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
