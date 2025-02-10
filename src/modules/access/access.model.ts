import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { userTable } from '../user/user.model';

export const accessTable = pgTable('access', {
    id: serial('id').primaryKey(),
    publicId: text('public_id').unique().notNull(),
    userId: integer('user_id').notNull().references(() => userTable.id),
    email: text('email').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
