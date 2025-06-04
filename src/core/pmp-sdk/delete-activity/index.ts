
import { GenericResponse } from "../types";
import { _delete } from "../utilities";

export const _deleteActivity = async (id: number) => {
  return _delete(`/events/${id}`, GenericResponse)
}