import { db } from "../../../../../db/connection";
import { RefreshTokenRepositoryInterface } from "./refresh-token-repository.interface";
import { refreshTokens } from "../../../../../db/schemas/refresh-tokens.schema";
import { RefreshTokenSchema } from "../schemas/refresh-token.schema";
import { eq, and } from "drizzle-orm";
import { users } from "../../../../../db/schemas/users.schema";
import { Database, Transaction } from "../../../../../types/db/database";

export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
    constructor(private db: Database | Transaction) {}

    async saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<RefreshTokenSchema> {
        const [result] = await db.insert(refreshTokens).values({ token, userId, expiresAt }).returning();
        return result;
    }

    async findRefreshToken(token: string): Promise<RefreshTokenSchema> {
        const [result] = await db.select().from(refreshTokens).where(and(eq(refreshTokens.token, token), (eq(refreshTokens.revoked, false)))).limit(1);
        return result;
    }

    async findRefreshTokenWithUser(token: string): Promise<any> {
        const [result] = await db.select().from(refreshTokens).leftJoin(users, eq(users.id, refreshTokens.userId)).where(eq(refreshTokens.token, token)).limit(1);
        return result;
    }

    async revokeRefreshToken(token: string): Promise<RefreshTokenSchema> {
        const [result] = await db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.token, token)).returning();
        return result;
    }

    async deleteRefreshToken(token: string): Promise<RefreshTokenSchema> {
        const [result] = await db.delete(refreshTokens).where(eq(refreshTokens.token, token)).returning();
        return result;
    }
}
