import { CreatePasswordResetPayload, GenericResponse } from "../types";
import { _post } from "../utilities";

export const _createPasswordReset = async (payload: CreatePasswordResetPayload) => {
  return _post('/create-password-reset', {
    ...payload
  }, GenericResponse)
}