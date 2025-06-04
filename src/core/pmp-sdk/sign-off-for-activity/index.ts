import { GenericResponse } from "../types";
import { _post } from "../utilities";

export const _signOffForActivity = async (id: number) => {
  return _post(`/events/signOff?id=${id}`, {
  }, GenericResponse)
}