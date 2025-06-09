import { AuthSuccessResponse } from "../types"
import { _post } from "../utilities"

export const _register = async (
    name: FormDataEntryValue, role: FormDataEntryValue, seniority: FormDataEntryValue, status: FormDataEntryValue,
    email: FormDataEntryValue, password: FormDataEntryValue, code: FormDataEntryValue
) => {
  return _post('/users', {
    name: name,
    role: role,
    seniority: seniority,
    status: status,
    email: email,
    password: password,
    code: code
  }, AuthSuccessResponse)
}