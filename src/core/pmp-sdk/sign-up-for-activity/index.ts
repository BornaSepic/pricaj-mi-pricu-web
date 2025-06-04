import { GenericResponse } from "../types";
import { _post } from "../utilities";

export const _signUpForActivity = async (id: number) => {
  return _post(`/events/signUp?id=${id}`, {
  }, GenericResponse)
}