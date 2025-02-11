import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../users/schemas/users-schema.ts";
import { itemTemplates } from "../../items/schemas/items/items-templates-schema.ts";
import { AnyType } from "../../../../../types/any-type.ts";
import { Organization } from "../models/organization-model.ts";
import { nanoid } from "nanoid";
import { OrganizationTiers } from "../definitions/enums/organization-tiers-enum.ts";

export const organizationTiers = pgEnum('organization_tiers', Object.values(OrganizationTiers) as [string, ...string[]]);

const columns: AnyType<Organization> = {
    id: text('id').$defaultFn(() => nanoid()).primaryKey(),
    authorId: text('author_id').references(() => users.id),
    organizationCode: text('code').unique().notNull(),
    name: text('name').notNull(),
    tier: organizationTiers().notNull(),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const organizations = pgTable('organizations', columns);

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
    author: one(users, { fields: [organizations.authorId], references: [users.id] }),
    users: many(users),
    items: many(itemTemplates),
}))
