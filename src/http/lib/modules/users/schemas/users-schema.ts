import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { User } from '../models/user-model.ts';
import { organizations } from '../../organizations/schemas/organizations-schema.ts';
import { AnyType } from '../../../../../types/any-type.ts';
import { relations } from 'drizzle-orm';

export const userTypes = pgEnum('user_types', ['admin', 'staff', 'root', 'invited']);

const columns: AnyType<User> = {
    id: text('id').$defaultFn(() => nanoid()).primaryKey(),
    organizationId: text('organization_id').references(() => organizations.id),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    type: userTypes().notNull(),
    active: boolean('active').notNull().default(true),
    authenticated: boolean('authenticated').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const users = pgTable('users', columns)

export const usersRelations = relations(users, ({ one }) => ({
    organization: one(organizations, { fields: [users.organizationId], references: [organizations.id]})
 }))
