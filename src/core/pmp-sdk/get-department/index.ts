import { Department } from "../types"
import { get } from "../utilities"

export const _getDepartment = async (id: string): Promise<Department | null> => {
  return get(`/departments/${id}`, Department)
}