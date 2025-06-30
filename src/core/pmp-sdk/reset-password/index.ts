import { ResetPasswordPayload, GenericResponse } from "../types";
import { _post } from "../utilities";

export const _resetPassword = async (payload: ResetPasswordPayload) => {
  return _post('/reset-password', {
    ...payload
  }, GenericResponse)
}