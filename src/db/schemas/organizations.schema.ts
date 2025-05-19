import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.ts";
import { AnyType } from "../../types/any-type.js";
import { Organization, organizationSchema } from "../../http/lib/modules/organizations/organizations.schema.ts";
import { ValidateTableAgainstZodSchema } from "../../types/validation/validate-table-against-zod-schema.js";
import { relations } from "drizzle-orm";
import { usersOrganizations } from "./users-organizations.schema.ts";

const columns: AnyType<Organization> = {
    id: text('id').primaryKey(),
    ownerId: text('author_id').references(() => users.id),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    password: text('password'),
    description: text('description'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('creation_date').notNull().defaultNow(),
    updatedAt: timestamp('update_date').notNull().defaultNow(),
};

export const organizations = pgTable('organizations', columns);

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
    usersOrganizations: many(usersOrganizations),
}))


// export const organizationsRelations = relations(organizations, ({ one, many }) => ({
//     author: one(users, { fields: [organizations.author], references: [users.id] }),
//     // users: many(users),
//     // items: many(itemTemplates),
// }))
