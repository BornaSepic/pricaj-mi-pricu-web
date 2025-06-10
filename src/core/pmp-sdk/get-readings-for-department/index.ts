import { ReadingsByDate } from "../types"
import { _get } from "../utilities"

export const _getReadingsForDepartment = async (id: string, status: 'active' | 'inactive') => {
  return _get(`/readings/list?departmentId=${id}&status=${status}`, ReadingsByDate)
}