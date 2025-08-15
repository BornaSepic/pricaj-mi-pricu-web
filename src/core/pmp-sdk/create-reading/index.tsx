import { ReadingCreateResponse } from "../types";
import { _post } from "../utilities";

export const _createReading = async (userId: number | null, date: string, departmentId: number) => {
  return _post('/readings', {
    userId: userId || null,
    date: date,
    departmentId: departmentId
  }, ReadingCreateResponse)
}
