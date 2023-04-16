import {http} from "./index";

export const getUserSubjects = () => http.get("/subjects/my")
