import { CreateActivityPayload, GenericResponse } from "../types";
import { _post } from "../utilities";

export const _createActivity = async (event: CreateActivityPayload) => {
  return _post('/events', {
    ...event
  }, GenericResponse)
}