import { User } from "../pmp-sdk/types";
import { decodeJwt } from "./decode-jwt";

export const getUserFromToken = (): User | null => {
  if(typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  const decodedToken = decodeJwt(token)

  const { data, success, error } = User.safeParse(decodedToken);

  if (!success) {
    console.log("Failed to parse user from token:", error);
    return null;
  }

  return data;
}