import { db } from "../../../../../db/connection";
import { RefreshTokenRepositoryInterface } from "./refresh-token-repository.interface";
import { refreshTokens } from "../schemas/refresh-tokens-schema";
import { RefreshToken } from "../models/refresh-token-model";
import { eq } from "drizzle-orm";

export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
    async saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<RefreshToken> {
        const [result] = await db.insert(refreshTokens).values({ token, userId, expiresAt }).returning();
        return result;
    }

    async findRefreshToken(token: string): Promise<RefreshToken> {
        const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
        return result;
    }

    async expireRefreshToken(token: string): Promise<RefreshToken> {
        const [result] = await db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.token, token)).returning();
        return result;
    }

    async deleteRefreshToken(token: string): Promise<RefreshToken> {
        const [result] = await db.delete(refreshTokens).where(eq(refreshTokens.token, token)).returning();
        return result;
    }
}
