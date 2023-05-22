import { http } from './index';

export const addNewItemStudyPlan = (data: {
  subjectId: string;
  topic: string;
  description?: string;
  order: number;
}) => http.post('/study-plan/', data);

export const getPlanDataById = (id: string) => http.get(`/study-plan/${id}`);

export const createNewCriteria = (data: any) =>
  http.post('/study-plan/criteria', data);

export const removeItem = (id: string) => http.delete(`/study-plan/${id}`);
