import { RegistrationCode } from "../types";
import { _get } from "../utilities";

export const _getRegistrationCode = async () => {
  const registrationCode = await _get(`/registration-codes`, RegistrationCode)

  return registrationCode.code;
};
