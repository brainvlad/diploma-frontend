import { http } from "../index";
import * as AuthTypes from "../../types/auth";
import { AxiosResponse } from "axios";

export const login = async (data: AuthTypes.Request.Login) =>
  http.post("/auth/login/email", data);

export const refresh = async (access: string) => {
  return http.post("/auth/refresh", { access });
};

export const register = async (data: any) => http.post("/auth/register", data);

export const getAuthUserData = async (): Promise<
  AxiosResponse<AuthTypes.AuthUserInfo>
> => http.get("/auth/user");
