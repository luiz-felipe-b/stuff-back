import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { assetTemplates } from './assets-templates.schema.ts';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../users.schema.ts';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    templateId: text('template_id').notNull().references(() => assetTemplates.id),
    creatorUserId: text('creator_user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description').notNull(),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const assetInstances = pgTable('item_instances', columns);

export const assetInstancesRelations = relations(assetInstances, ({ one }) => ({
    template: one(assetTemplates, { fields: [assetInstances.templateId], references: [assetTemplates.id]}),
    creator: one(users, { fields: [assetInstances.creatorUserId], references: [users.id]
 })}));
