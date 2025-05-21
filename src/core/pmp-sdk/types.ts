import { z } from "zod";

export const AuthSuccessResponse = z.object({
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

export const Department = z.object({
  id: z.number(),
  name: z.string(),
})

export type Department = z.infer<typeof Department>

export const Departments = z.array(Department)

export const Event = z.object({
  id: z.number(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  users: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  })),
})

export type Event = z.infer<typeof Event>

export const Events = z.array(Event)

export const Reading = z.object({
  id: z.number(),
  blocked: z.boolean(),
  date: z.string(),
  user: User,
  department: Department,
  report: z.object({

  }).nullable().optional(),
})

export type Reading = z.infer<typeof Reading>

export const ReadingsByDate = z.array(
  z.object({
    date: z.string(),
    readings: z.array(Reading),
  })
)

export const ReadingCreateResponse = z.object({})
export const ReadingDeleteResponse = z.object({})
