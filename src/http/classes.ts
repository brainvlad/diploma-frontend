import { http } from "./index";

export const getGroupsBySubjects = (subjectId: string) =>
  http.get(`/classes/subject/${subjectId}`);

export const getGradesTableByClass = (classId: string) => http.get(`/classes/${classId}/table`)
