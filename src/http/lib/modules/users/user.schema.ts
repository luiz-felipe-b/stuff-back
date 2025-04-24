import { z } from 'zod';

// User schema
export const userSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['admin', 'moderator', 'user']),
    tier: z.enum(['free', 'plus', 'pro', 'enterprise']),
    active: z.boolean(),
    authenticated: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const publicUserSchema = userSchema.omit({
    password: true,
});

export type User = z.infer<typeof userSchema>;

export type PublicUser = z.infer<typeof publicUserSchema>;

// Create user request body
export const createUserSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['admin', 'moderator', 'user']).optional().default('user'),
    tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional().default('free'),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

// Update user request body
export const updateUserSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    role: z.enum(['admin', 'moderator', 'user']).optional(),
    tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

// Update password request body
export const updatePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8)
});

// User parameters
export const userIdParamSchema = z.object({
    id: z.string()
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string()
});

