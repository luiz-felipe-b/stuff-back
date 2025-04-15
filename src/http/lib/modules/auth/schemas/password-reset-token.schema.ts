import { z } from 'zod';

export const passwordResetTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    token: z.string(),
    revoked: z.boolean(),
    expiresAt: z.date(),
    createdAt: z.date(),
});

export type PasswordResetTokenSchema = z.infer<typeof passwordResetTokenSchema>;