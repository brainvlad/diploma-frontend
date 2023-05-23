import { http } from "./index";

export const getAllFaculties = () => http.get(`/faculty`);
