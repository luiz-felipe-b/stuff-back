import { pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { attributes } from "../attributes-schema.ts";
import { relations } from "drizzle-orm";

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    link: text('value').notNull(),
}

export const fileAttributes = pgTable('file_attributes', columns);

export const fileAttributesRelations = relations(fileAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [fileAttributes.attributeId], references: [attributes.id] }),
}));
