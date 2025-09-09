import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { attributeTypes } from '../../../../http/lib/modules/assets/types/attribute-types.ts';
import { organizations } from '../../organizations.schema.ts';
import { v4 as uuidv4 } from 'uuid';
import { relations } from 'drizzle-orm';
import { users } from '../../users.schema.ts';
// import { dateValues, metricUnitValues, numberValues, textValues } from '../schemas.ts';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    organizationId: text('organization_id').references(() => organizations.id),
    authorId: text('author_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description'),
    type: pgEnum('attribute_type', attributeTypes)('type').notNull(),
    unit: text('unit'), // for metric
    timeUnit: text('time_unit'), // for timemetric
    options: text('options'), // Comma-separated string for selection/multiselection options
    required: boolean('required').notNull().default(false),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const attributes = pgTable('attributes', columns);

export const attributesRelations = relations(attributes, ({ one, many }) => ({
    // assetTemplate: one(assetTemplates, { fields: [attributes.assetTemplateId], references: [assetTemplates.id] }),
    organization: one(organizations, { fields: [attributes.organizationId], references: [organizations.id] }),
    author: one(users, { fields: [attributes.authorId], references: [users.id] }),
    // numberValues: many(numberValues),
    // textValues: many(textValues),
    // dateValues: many(dateValues),
    // metricUnitValues: many(metricUnitValues),
}))
