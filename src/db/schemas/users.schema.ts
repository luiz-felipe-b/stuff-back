import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { User } from '../../http/lib/modules/users/user.schema.ts';
import { AnyType } from '../../types/any-type.js';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations.schema.ts';

export const userRoles = pgEnum('user_types', ['admin', 'moderator', 'user']);

export const userTiers = pgEnum('user_tiers', ['free', 'plus', 'pro', 'enterprise']);

const columns: AnyType<User> = {
    id: text('id').$defaultFn(() => nanoid()).primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: userRoles('role').notNull().default('user'),
    tier: userTiers('tier').notNull().default('free'),
    // resetPasswordToken: text('reset_password_token'),
    // resetPasswordExpires: timestamp('reset_password_expires'),
    active: boolean('active').notNull().default(true),
    authenticated: boolean('authenticated').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const users = pgTable('users', columns)

