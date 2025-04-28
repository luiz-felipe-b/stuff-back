import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema.ts';
import { v4 as uuidv4 } from 'uuid';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    revoked: boolean('revoked').notNull().default(false),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}

export const passwordResetTokens = pgTable('password_reset_tokens', columns);
