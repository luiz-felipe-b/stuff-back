import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../attributes-schema.ts";

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    value: timestamp('value').notNull(),
}

export const dateAttributes = pgTable('date_attributes', columns);

export const dateAttributesRelations = relations(dateAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [dateAttributes.attributeId], references: [attributes.id] }),
}));
