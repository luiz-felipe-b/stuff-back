import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users.schema.ts";
import { itemTemplates } from "../../http/lib/modules/items/schemas/items/items-templates-schema.ts";
import { AnyType } from "../../types/any-type.js";

const columns: AnyType<any> = {
    id: text('id').primaryKey(),
    author: text('author_id').references(() => users.id),
    organizationSlug: text('slug').notNull(),
    name: text('name').notNull(),
    active: boolean('active').notNull().default(true),
    creationDate: text('creation_date').notNull(),
}

export const organizations = pgTable('organizations', columns);

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
    author: one(users, { fields: [organizations.author], references: [users.id] }),
    // users: many(users),
    // items: many(itemTemplates),
}))
