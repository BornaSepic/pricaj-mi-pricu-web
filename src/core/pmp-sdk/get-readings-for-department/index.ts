import { ReadingsByDate } from "../../types/readings"
import { get } from "../utilities"

export const _getReadingsForDepartment = async (id: string, status: 'active' | 'inactive') => {
  return get(`/readings/list?departmentId=${id}&status=${status}`, ReadingsByDate)
}