import { z } from "zod";

export const requestUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'moderator', 'user']),
})

export type RequestUser = z.infer<typeof requestUserSchema>;