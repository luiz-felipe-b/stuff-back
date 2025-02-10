import { pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../attributes-schema.ts";
import { relations } from "drizzle-orm";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: text('value').notNull(),
}

export const textAttributes = pgTable('text_attributes', columns);

export const textAttributesRelations = relations(textAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [textAttributes.attributeId], references: [attributes.id] }),
}));
