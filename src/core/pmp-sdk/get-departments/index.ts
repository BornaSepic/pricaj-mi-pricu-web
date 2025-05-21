import { Departments } from "../types"
import { _get } from "../utilities"

export const _getDepartments = async () => {
  return _get(`/departments/`, Departments)
}