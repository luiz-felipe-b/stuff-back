import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { attributes } from "../attributes.schema.ts";
import { relations } from "drizzle-orm";
import { assetInstances } from "../../assets-instances.schema.ts";

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    assetInstanceId: text('asset_instance_id').notNull().references(() => assetInstances.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const textValues = pgTable('text_values', columns);

export const textValuesRelations = relations(textValues, ({ one }) => ({
    assetInstance: one(assetInstances, { fields: [textValues.assetInstanceId], references: [assetInstances.id] }),
    attribute: one(attributes, { fields: [textValues.attributeId], references: [attributes.id] }),
}));
