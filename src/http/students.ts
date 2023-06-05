import { http } from "./index";

export const getAllStudents = (
  options: Partial<{
    facultyId: string;
    course: number;
    group: number;
    subGroup: number;
  }> = {}
) => http.get("/students", { params: options });

export const getAllStudentsByGroup = (groupId: string) =>
  http.get(`/students/group/${groupId}`);

export const addNewStudent = (data: {
  groupsId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}) => http.post("/students", data);

export const getStudentById = (id: string) => http.get(`/students/${id}`);

export const updateStudentInfo = (id: string, data: any) =>
  http.put(`/students/${id}`, data);

export const getStudentProfile = (id: string) =>
  http.get(`/students/profile/${id}`);

export const deleteStudent = (id: string) => http.delete(`/students/${id}`);
