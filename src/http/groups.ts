import { http } from "./index";

export const getUserGroups = () => http.get("/groups/my");

export const getAllGroups = () => http.get("/groups/");

export const createNewGroup = (data: any) => http.post("/groups/", data);
