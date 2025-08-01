import { Department, GenericResponse } from "../types";
import { _patch, _post } from "../utilities";

export const _createDepartment = async (department: {
  name: string;
}) => {
  return _post(`/departments`, {
    name: department.name
  }, GenericResponse)
}