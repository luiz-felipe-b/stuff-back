import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
// import { organizations } from '../../../organizations/schemas/organizations-schema.ts';
import { v4 as uuidv4 } from 'uuid';
import { relations } from 'drizzle-orm';
import { organizations } from '../organizations.schema.ts';
import { users } from '../users.schema.ts';
import { assetInstances } from './assets-instances.schema.ts';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    organizationId: text('organization_id').references(() => organizations.id),
    creatorUserId: text('creator_user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description'),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const assetTemplates = pgTable('assets_templates', columns);

export const assetTemplatesRelations = relations(assetTemplates, ({ one, many }) => ({
    organization: one(organizations, { fields: [assetTemplates.organizationId], references: [organizations.id]}),
    creator: one(users, { fields: [assetTemplates.creatorUserId], references: [users.id] }),
    instances: many(assetInstances),
 }))
