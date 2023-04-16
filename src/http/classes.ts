import {http} from "./index"

export const getGroupsBySubjects = (subjectId: string) => http.get(`/classes/subject/${subjectId}`)
