import { z } from "zod";

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