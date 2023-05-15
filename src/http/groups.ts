import { http } from "./index";

export const getUserGroups = () => http.get("/groups/my");

export const getAllGroups = () => http.get("/groups/");

export const getGroupById = (id: string) => http.get(`/groups/${id}`);

export const createNewGroup = (data: any) => http.post("/groups/", data);

export const activateGroup = (id: string) =>
  http.patch(`/groups/${id}/activate`);
export const deactivateGroup = (id: string) =>
  http.patch(`/groups/${id}/deactivate`);

export const shareGroup = (id: string) => http.patch(`/groups/${id}/share`);
export const unshareGroup = (id: string) => http.patch(`/groups/${id}/unshare`);
