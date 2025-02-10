import { RefreshToken } from "../models/refresh-token-model";

export interface RefreshTokenRepositoryInterface {
    saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<RefreshToken>;
    findRefreshToken(token: string): Promise<RefreshToken | null>;
    expireRefreshToken(token: string): Promise<RefreshToken | null>;
    deleteRefreshToken(token: string): Promise<RefreshToken>;
}
