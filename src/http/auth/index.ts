import { http } from "../index";
import * as AuthTypes from "../../types/auth";
import { AxiosResponse } from "axios";

export const login = async (data: AuthTypes.Request.Login) =>
  http.post("/auth/login/email", data);

export const refresh = async (access: string) => {
  return http.post("/auth/refresh", { access });
};

export const register = async (data: AuthTypes.Request.Register) =>
  http.post("/auth/register", data);

export const getAuthUserData = async (): Promise<
  AxiosResponse<AuthTypes.AuthUserInfo>
> => http.get("/auth/user");

export const confirmEmail = async (token: string) =>
  http.post(`/auth/confirm-email`, { activationCode: token });
