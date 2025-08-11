import { GenericResponse, UserData } from "../types";
import { _patch, _post } from "../utilities";

export const _updateUser = async (user: UserData) => {
  return _patch(`/users/${user.id}`, {
    email: user.email,
    phone: user.phone,
    name: user.name,
    seniority: user.seniority,
    status: user.status,
  }, GenericResponse)
}
