import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../../attributes-schema.ts";
import { selectionOptionsAttributes } from "./selection-options-attributes-schema.ts";

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    multi: boolean('value').notNull().$default(() => false),
}

export const selectionAttributes = pgTable('selection_attributes', columns);

export const selectionAttributesRelations = relations(selectionAttributes, ({ one, many }) => ({
    attribute: one(attributes, { fields: [selectionAttributes.attributeId], references: [attributes.id] }),
    option: many(selectionOptionsAttributes)
}));
