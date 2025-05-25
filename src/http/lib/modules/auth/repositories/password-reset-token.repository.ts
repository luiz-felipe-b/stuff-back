import { PgTransaction } from "drizzle-orm/pg-core";
import { db } from "../../../../../db/connection";
import { passwordResetTokens } from "../../../../../db/schemas/password-reset-tokens.schema";
import { users } from "../../../../../db/schemas/users.schema";
import { PasswordResetTokenSchema } from "../schemas/password-reset-token.schema";
import { eq, and } from "drizzle-orm";
import { Database, Transaction } from "../../../../../types/db/database";


export class PasswordResetTokenRepository{
    constructor(private db: Database | Transaction) {}

    async savePasswordResetToken(token: string, userId: string, expiresAt: Date): Promise<PasswordResetTokenSchema> {
        const [result] = await this.db.insert(passwordResetTokens).values({ token, userId, expiresAt }).returning();
        return result;
    }

    async findPasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await this.db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
        return result;
    }

    async findPasswordResetTokenWithUser(token: string): Promise<{userId: string | null; revoked: boolean; expiresAt: Date}> {
        const [result] = await this.db.select({ userId: users.id, revoked: passwordResetTokens.revoked, expiresAt: passwordResetTokens.expiresAt }).from(passwordResetTokens).leftJoin(users, eq(users.id, passwordResetTokens.userId)).where(eq(passwordResetTokens.token, token));
        return result;
    }

    async revokePasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await this.db.update(passwordResetTokens).set({ revoked: true }).where(eq(passwordResetTokens.token, token)).returning();
        return result;
    }

    async deletePasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await this.db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token)).returning();
        return result;
    }
}
