import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { itemTemplates } from './items-templates-schema.ts';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    templateId: text('template_id').notNull().references(() => itemTemplates.id),
    name: text('name').notNull(),
    description: text('description').notNull(),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const itemInstances = pgTable('item_instances', columns);

export const itemInstancesRelations = relations(itemInstances, ({ one }) => ({
    template: one(itemTemplates, { fields: [itemInstances.templateId], references: [itemTemplates.id]})
 }))
