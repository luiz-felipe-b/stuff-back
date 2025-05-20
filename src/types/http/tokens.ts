import { z } from "zod";

export const accessTokenSchema = z.object({
    id: z.string().uuid(),
    role: z.enum(['admin', 'moderator', 'user']),
});
export type AccessTokenPayload = z.infer<typeof accessTokenSchema>;

export const refreshTokenSchema = z.object({
    id: z.string().uuid(),
});
export type RefreshTokenPayload = z.infer<typeof refreshTokenSchema>;