import { AppDispatch } from "../../index";
import * as AuthTypes from "../../../types/auth";
import { getAuthUserData, login, register } from "../../../http/auth";
import { authSlice } from "./slice";
import axios, { AxiosError } from "axios";

export const loginAction =
  (data: AuthTypes.Request.Login) => async (dispatch: AppDispatch) => {
    try {
      dispatch(authSlice.actions.authFetch());
      const res = await login(data);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      dispatch(authSlice.actions.authSuccess(res.data));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const serverError = e as AxiosError;
        dispatch(
          authSlice.actions.authFailed(
            serverError.response && serverError.response.data
          )
        );
      }
    }
  };
