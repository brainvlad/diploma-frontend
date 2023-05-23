import { AppDispatch } from "../../index";
import * as AuthTypes from "../../../types/auth";
import { getAuthUserData, login, register } from "../../../http/auth";
import { authSlice } from "./slice";
import axios, { AxiosError } from "axios";

export const loginAction = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(authSlice.actions.authFetch());
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    const user = await getAuthUserData();
    dispatch(authSlice.actions.authSuccess({ ...data, user: user.data }));
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
