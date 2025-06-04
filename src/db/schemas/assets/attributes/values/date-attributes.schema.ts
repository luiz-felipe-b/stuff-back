import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { assetInstances } from "../../assets-instances.schema.ts";
import { attributes } from "../attributes.schema.ts";
import { relations } from "drizzle-orm";

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    assetInstanceId: text('asset_instance_id').notNull().references(() => assetInstances.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: timestamp('value').notNull(),
}

export const dateValues = pgTable('date_values', columns);

export const dateValuesRelations = relations(dateValues, ({ one }) => ({
    assetInstance: one(assetInstances, { fields: [dateValues.assetInstanceId], references: [assetInstances.id] }),
    attribute: one(attributes, { fields: [dateValues.attributeId], references: [attributes.id] }),
}));

