import { ReadingCreateResponse } from "../types";
import { post } from "../utilities";

export const _createReading = async (date: string, departmentId: number) => {
  return post('/readings', {
    date: date,
    departmentId: departmentId,
    test: true
  }, ReadingCreateResponse)
}