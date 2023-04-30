import { http } from "./index";

export const getUserGroups = () => http.get("/groups/my");

export const getAllGroups = () => http.get("/groups/");

export const getGroupById = (id: string) => http.get(`/groups/${id}`);

export const createNewGroup = (data: any) => http.post("/groups/", data);
