import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
    id: serial('id').primaryKey(),
    publicId: text('public_id').unique().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
