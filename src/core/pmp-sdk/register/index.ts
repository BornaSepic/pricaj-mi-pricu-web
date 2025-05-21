import { AuthSuccessResponse } from "../types"
import { _post } from "../utilities"

export const _register = async (email: FormDataEntryValue, password: FormDataEntryValue) => {
  return _post('/auth/register', {
    email: email,
    password: password
  }, AuthSuccessResponse)
}