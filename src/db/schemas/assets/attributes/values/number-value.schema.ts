import { relations } from "drizzle-orm";
import { pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { attributes } from "../attributes.schema.ts";
import { assetInstances } from "../../assets-instances.schema.ts";

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    assetInstanceId: text('asset_instance_id').notNull().references(() => assetInstances.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: real('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const numberValues = pgTable('number_values', columns);

export const numberValuesRelations = relations(numberValues, ({ one }) => ({
    assetInstance: one(assetInstances, { fields: [numberValues.assetInstanceId], references: [assetInstances.id] }),
    attribute: one(attributes, { fields: [numberValues.attributeId], references: [attributes.id] }),
}));
