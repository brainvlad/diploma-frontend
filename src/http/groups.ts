import { http } from "./index";

export const getUserGroups = () => http.get("/groups/my");
