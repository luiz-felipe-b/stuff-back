import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../attributes-schema.ts";
import { relations } from "drizzle-orm";

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    value: boolean('value').notNull(),
}

export const switchAttributes = pgTable('switch_attributes', columns);

export const switchAttributesRelations = relations(switchAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [switchAttributes.attributeId], references: [attributes.id] }),
}));
