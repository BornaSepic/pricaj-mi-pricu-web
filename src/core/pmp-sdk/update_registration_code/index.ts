import { GenericResponse } from "../types"
import { _patch } from "../utilities"

export const _updateRegistrationCode = async (code: string) => {
    return _patch(`/registration-codes`, {
        code,
        isValid: true
    }, GenericResponse)
}
