import { z } from "zod"
import { User } from "../types"
import { _get } from "../utilities"

export const _getUsers = async (): Promise<User[] | null> => {
  return _get(`/users/list`, z.array(User))
}