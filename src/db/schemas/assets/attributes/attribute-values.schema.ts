import { pgTable, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';
import { assets } from '../assets.schema.ts';
import { attributes } from './attributes.schema.ts';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    assetInstanceId: text('asset_id').notNull().references(() => assets.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const attributeValues = pgTable('attribute_values', columns);
