import { http } from "./index";

export const getAllFaculties = () => http.get(`/faculty`);

export const createFaculty = (data: { name: string; shortName: string }) =>
  http.post("/faculty", data);

export const updateFaculty = (data: {
  id: string;
  name: string;
  shortName: string;
}) => http.put("/faculty", data);
