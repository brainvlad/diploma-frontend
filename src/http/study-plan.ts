import { http } from "./index";

export const addNewItemStudyPlan = (data: {
  subjectId: string;
  topic: string;
  description?: string;
  order: number;
}) => http.post(`/study-plan/`, data);
