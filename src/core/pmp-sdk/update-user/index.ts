import { Department, GenericResponse, User } from "../types";
import { _patch, _post } from "../utilities";

export const _updateUser = async (user: {
  id: number;
  email: string;
  phone: string;
  name: string;
  seniority: string;
}) => {
  return _patch(`/users/${user.id}`, {
    email: user.email,
    phone: user.phone,
    name: user.name,
    seniority: user.seniority
  }, GenericResponse)
}