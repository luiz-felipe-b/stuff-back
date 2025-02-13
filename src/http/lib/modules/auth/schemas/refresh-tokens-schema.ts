import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { users } from '../../users/schemas/users-schema.ts';

const columns = {
    id: text('id').$defaultFn(() => nanoid()).primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    token: text('token').notNull(),
    revoked: boolean('revoked').notNull().default(false),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}

export const refreshTokens = pgTable('refresh_tokens', columns);
