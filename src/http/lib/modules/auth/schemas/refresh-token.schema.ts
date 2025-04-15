import { z } from 'zod';

export const refreshTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    token: z.string(),
    revoked: z.boolean(),
    expiresAt: z.date(),
    createdAt: z.date(),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;