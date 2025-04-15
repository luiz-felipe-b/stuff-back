import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    organizationId: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['admin', 'moderator', 'user']),
    tier: z.enum(['free', 'plus', 'pro', 'enterprise']),
    resetPasswordToken: z.string().nullable(),
    resetPasswordExpires: z.date().nullable(),
    active: z.boolean(),
    authenticated: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
