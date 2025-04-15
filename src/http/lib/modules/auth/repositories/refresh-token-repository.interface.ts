import { RefreshTokenSchema } from "../schemas/refresh-token.schema";

export interface RefreshTokenRepositoryInterface {
    saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<RefreshTokenSchema>;
    findRefreshToken(token: string): Promise<RefreshTokenSchema | null>;
    revokeRefreshToken(token: string): Promise<RefreshTokenSchema | null>;
    deleteRefreshToken(token: string): Promise<RefreshTokenSchema>;
}
