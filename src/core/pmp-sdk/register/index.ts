import { AuthSuccessResponse } from "../types"
import { post } from "../utilities"

export const _register = async (email: FormDataEntryValue, password: FormDataEntryValue) => {
  return post('/auth/register', {
    email: email,
    password: password
  }, AuthSuccessResponse)
}