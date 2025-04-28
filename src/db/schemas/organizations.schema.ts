import { Column, relations } from "drizzle-orm";
import { boolean, date, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users.schema.ts";
import { itemTemplates } from "../../http/lib/modules/items/schemas/items/items-templates-schema.ts";
import { AnyType } from "../../types/any-type.js";
import { Organization, organizationSchema } from "../../http/lib/modules/organizations/organizations.schema.ts";
import { ValidateTableAgainstZodSchema } from "../../types/validation/validate-table-against-zod-schema.js";

const columns = {
    id: text('id').primaryKey(),
    ownerId: text('author_id').references(() => users.id),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    password: boolean('password'),
    description: text('description').notNull(),
    active: boolean('active').notNull().default(true),
    createdAt: date('creation_date').notNull(),
    updatedAt: date('update_date').notNull(),
    logo: text('logo'),
} satisfies ValidateTableAgainstZodSchema<typeof columns, typeof organizationSchema>;

export const organizations = pgTable('organizations', columns);

// export const organizationsRelations = relations(organizations, ({ one, many }) => ({
//     author: one(users, { fields: [organizations.author], references: [users.id] }),
//     // users: many(users),
//     // items: many(itemTemplates),
// }))
