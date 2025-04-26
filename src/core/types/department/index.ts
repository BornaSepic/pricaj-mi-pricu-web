import { z } from "zod";

export const Department = z.object({
  id: z.number(),
  name: z.string(),
})

export type Department = z.infer<typeof Department>

export const Departments = z.array(Department)