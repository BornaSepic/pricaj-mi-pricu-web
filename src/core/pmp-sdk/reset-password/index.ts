import { ResetPasswordPayload, GenericResponse } from "../types";
import { _put } from "../utilities";

export const _resetPassword = async (payload: ResetPasswordPayload) => {
  return _put('/users/reset-password', {
    ...payload
  }, GenericResponse)
}