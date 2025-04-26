import { z } from "zod";

export const Event = z.object({
    id: z.number(),
    name: z.string(),
})

export type Event = z.infer<typeof Event>

export const Events = z.array(Event)