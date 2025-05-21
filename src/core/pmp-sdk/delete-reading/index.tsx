import { ReadingDeleteResponse } from "../types";
import { _delete } from "../utilities";

export const _deleteReading = async (id: number) => {
  return _delete(`/readings/${id}`, ReadingDeleteResponse)
}