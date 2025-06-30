import { z } from "zod";

export const AuthSuccessResponse = z.object({
  access_token: z.string(),
})

export const Report = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  /*reading,
  created_at,
  updated_at*/
})

export type Report = z.infer<typeof Report>

export const User = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  seniority: z.enum(["senior", "junior"]),
})

export type User = z.infer<typeof User>

export const ProfileSuccessResponse = User.nullable()

export const Department = z.object({
  id: z.number(),
  name: z.string(),
})

export type Department = z.infer<typeof Department>

export const Departments = z.array(Department)

export const ResetPasswordPayload = z.object({
  token: z.string(),
  password: z.string()
})

export type ResetPasswordPayload = z.infer<typeof ResetPasswordPayload>

export const CreatePasswordResetPayload = z.object({
  email: z.string().email(),
})

export type CreatePasswordResetPayload = z.infer<typeof CreatePasswordResetPayload>

export const CreateActivityPayload = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
})

export type CreateActivityPayload = z.infer<typeof CreateActivityPayload>

export const Activity = z.object({
  id: z.number(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  users: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    seniority: z.enum(["senior", "junior"]),
  })),
})

export type Activity = z.infer<typeof Activity>

export const Activities = z.array(Activity)

export const Reading = z.object({
  id: z.number(),
  blocked: z.boolean(),
  date: z.string(),
  user: User,
  department: Department,
  report: Report.nullable().optional(),
})

export type Reading = z.infer<typeof Reading>

export const ReadingsByDate = z.array(
  z.object({
    date: z.string(),
    readings: z.array(Reading),
  })
)

export const GenericResponse = z.object({})
export const ReadingCreateResponse = z.object({})
export const ReadingDeleteResponse = z.object({})
export const ReportDeleteResponse = z.object({})
export const ReportCreateResponse = z.object({})
