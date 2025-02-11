import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from '../../../organizations/schemas/organizations-schema.ts';
import { itemInstances } from './items-instances-schema.ts';
import { nanoid } from 'nanoid';
import { relations } from 'drizzle-orm';
import { users } from '../../../users/schemas/users-schema.ts';

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    authorId: text('author_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description').notNull(),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const itemTemplates = pgTable('item_templates', columns);

export const itemTemplatesRelations = relations(itemTemplates, ({ one, many }) => ({
    organization: one(organizations, { fields: [itemTemplates.organizationId], references: [organizations.id]}),
    author: one(users, { fields: [itemTemplates.authorId], references: [users.id] }),
    instances: many(itemInstances),
 }))
