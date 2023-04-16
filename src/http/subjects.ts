import { http } from "./index";

export const getUserSubjects = () => http.get("/subjects/my");

export const createSubject = (data: {
  name: string | undefined;
  alias: string | undefined;
}) => http.post("/subjects/", data);

export const getStudyPlan = (subjectId: string) =>
  http.get(`/subjects/${subjectId}/plan`);
