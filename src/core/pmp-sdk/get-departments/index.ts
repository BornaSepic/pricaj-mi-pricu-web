import { Departments } from "../types"
import { get } from "../utilities"

export const _getDepartments = async () => {
  return get(`/departments/`, Departments)
}