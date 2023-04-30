import { http } from "./index";

export const getAllStudentsByGroup = (groupId: string) =>
  http.get(`/students/group/${groupId}`);

export const addNewStudent = (data: {
  groupsId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}) => http.post(`/students`, data);

export const getStudentById = (id: string) => http.get(`/students/${id}`);

export const updateStudentInfo = (id: string, data: any) =>
  http.put(`/students/${id}`, data);
