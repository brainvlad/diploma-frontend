import { http } from "./index";

export const getStatisticsByGroup = (data: {
  studyPlanItemIds: Array<string>;
  classId: string;
  comment?: string;
}) => http.post("/statistics/by-group", data);

export const getStatisticsViewById = (id: string) =>
  http.get(`/statistics/${id}`);

export const getListByClassId = (classId: string) =>
  http.get(`/statistics/class/${classId}`);

export const removeStatistics = (statisticsId: string) =>
  http.delete(`/statistics/${statisticsId}`);
