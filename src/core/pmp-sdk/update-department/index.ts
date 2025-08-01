import { Department, GenericResponse } from "../types";
import { _patch, _post } from "../utilities";

export const _updateDepartment = async (department: Department) => {
  return _patch(`/departments/${department.id}`, {
    id: department.id,
    name: department.name
  }, GenericResponse)
}