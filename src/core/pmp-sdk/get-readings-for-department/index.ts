import { ReadingsByDate } from "../../types/readings"
import { _get } from "../utilities"

export const _getReadingsForDepartment = async (id: string, status: 'active' | 'inactive') => {
  return _get(`/readings/list?departmentId=${id}&status=${status}`, ReadingsByDate)
}