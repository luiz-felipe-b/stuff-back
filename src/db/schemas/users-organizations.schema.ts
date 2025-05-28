import { relations } from "drizzle-orm";
import { users } from "./users.schema.ts";
import { pgTable, text, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.schema.ts";

const columns = {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}

export const usersOrganizations = pgTable('users_organizations', columns, (t) => [primaryKey({columns: [t.userId, t.organizationId]})]);

export const usersOrganizationsRelations = relations(usersOrganizations, ({ one }) => ({
    users: one(users, { fields: [usersOrganizations.userId], references: [users.id] }),
    organizations: one(organizations, { fields: [usersOrganizations.organizationId], references: [organizations.id] })
}));