import { z } from "zod";
import { User } from "../auth";
import { Department } from "../department";

export const Reading = z.object({
  id: z.number(),
  blocked: z.boolean(),
  date: z.string(),
  user: User,
  department: Department
})

export type Reading = z.infer<typeof Reading>

export const ReadingsPerDepartmentResponse = z.array(
  z.object({
    date: z.string(),
    readings: z.array(Reading),
  })
)