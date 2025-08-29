import { pgTable, text, boolean, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { assetTypes } from '../../../http/lib/modules/assets/types/asset-types.ts';
import { relations } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../users.schema.ts';
import { organizations } from '../organizations.schema.ts';

export const assetTypeEnum = pgEnum('asset_type', assetTypes);

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    type: assetTypeEnum('type').notNull(),
    quantity: integer('quantity'), // for replicable assets, can be null for unique
    organizationId: text('organization_id').references(() => organizations.id),
    creatorUserId: text('creator_user_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description'),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const assets = pgTable('assets', columns);

export const assetsRelations = relations(assets, ({ one }) => ({
    organization: one(organizations, { fields: [assets.organizationId], references: [organizations.id] }),
    creator: one(users, { fields: [assets.creatorUserId], references: [users.id] })
}));
