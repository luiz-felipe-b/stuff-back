import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { itemTemplates } from './items-templates-schema.ts';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { users } from '../../../users/schemas/users-schema.ts';

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    templateId: text('template_id').notNull().references(() => itemTemplates.id),
    authorId: text('author_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description').notNull(),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const itemInstances = pgTable('item_instances', columns);

export const itemInstancesRelations = relations(itemInstances, ({ one }) => ({
    template: one(itemTemplates, { fields: [itemInstances.templateId], references: [itemTemplates.id]}),
    author: one(users, { fields: [itemInstances.authorId], references: [users.id] }),
 }))
