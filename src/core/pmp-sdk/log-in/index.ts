import { AuthSuccessResponse } from "../types"
import { _post } from "../utilities"

export const _logIn = async (email: FormDataEntryValue, password: FormDataEntryValue) => {
  return _post('/auth/login', {
    email: email,
    password: password
  }, AuthSuccessResponse)
}