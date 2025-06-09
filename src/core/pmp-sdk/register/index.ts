import { AuthSuccessResponse } from "../types"
import { _post } from "../utilities"

export const _register = async (email: FormDataEntryValue, password: FormDataEntryValue, code: FormDataEntryValue) => {
  return _post('/users', {
    email: email,
    password: password,
    code: code
  }, AuthSuccessResponse)
}