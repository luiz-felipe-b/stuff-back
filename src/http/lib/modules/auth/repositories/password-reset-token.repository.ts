import { db } from "../../../../../db/connection";
import { passwordResetTokens } from "../../../../../db/schemas/password-reset-tokens.schema";
import { PasswordResetTokenSchema } from "../schemas/password-reset-token.schema";
import { eq, and } from "drizzle-orm";

export class PasswordResetTokenRepository{
    async savePasswordResetToken(token: string, userId: string, expiresAt: Date): Promise<PasswordResetTokenSchema> {
        const [result] = await db.insert(passwordResetTokens).values({ token, userId, expiresAt }).returning();
        return result;
    }

    async findPasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await db.select().from(passwordResetTokens).where(and(eq(passwordResetTokens.token, token), (eq(passwordResetTokens.revoked, false)))).limit(1);
        return result;
    }

    async revokePasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await db.update(passwordResetTokens).set({ revoked: true }).where(eq(passwordResetTokens.token, token)).returning();
        return result;
    }

    async deletePasswordResetToken(token: string): Promise<PasswordResetTokenSchema> {
        const [result] = await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token)).returning();
        return result;
    }
}
