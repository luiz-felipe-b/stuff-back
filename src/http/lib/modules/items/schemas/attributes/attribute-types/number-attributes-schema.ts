import { relations } from "drizzle-orm";
import { pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../attributes-schema.ts";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: real('value').notNull(),
}

export const numberAttributes = pgTable('number_attributes', columns);

export const numberAttributesRelations = relations(numberAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [numberAttributes.attributeId], references: [attributes.id] }),
}));
