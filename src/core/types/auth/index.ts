import { z } from "zod";

export const LoginSuccessResponse = z.object({
  access_token: z.string(),
})

export const User = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  seniority: z.enum(["senior", "junior"]),
})

export type User = z.infer<typeof User>

export const ProfileSuccessResponse = User.nullable()