import { Department } from "../types"
import { _get } from "../utilities"

export const _getDepartment = async (id: string): Promise<Department | null> => {
  return _get(`/departments/${id}`, Department)
}