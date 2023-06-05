import { http } from "./index";

export const getAllUsers = () => http.get("/users/all");

export const deactivate = (id: string) => http.post(`/users/${id}/deactivate`);

export const removeUser = (id: string) => http.delete(`/users/${id}`);
