import { AuthSuccessResponse } from "../types"
import { post } from "../utilities"

export const _logIn = async (email: FormDataEntryValue, password: FormDataEntryValue) => {
  return post('/auth/login', {
    email: email,
    password: password
  }, AuthSuccessResponse)
}