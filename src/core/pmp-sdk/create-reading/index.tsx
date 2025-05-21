import { ReadingCreateResponse } from "../types";
import { _post } from "../utilities";

export const _createReading = async (date: string, departmentId: number) => {
  return _post('/readings', {
    date: date,
    departmentId: departmentId,
    test: true
  }, ReadingCreateResponse)
}