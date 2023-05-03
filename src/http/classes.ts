import { http } from "./index";

export const getGroupsBySubjects = (subjectId: string) =>
  http.get(`/classes/subject/${subjectId}`);

export const getGradesTableByClass = (classId: string) =>
  http.get(`/classes/${classId}/table`);

export const setStudentGrade = (data: any) => http.post(`/grades/`, data);

export const createNewClass = (data: { subjectId: string; groupId: string }) =>
  http.post("/classes/", data);
