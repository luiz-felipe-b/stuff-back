import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { selectionAttributes } from "./selection-attributes-schema.ts";

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    selectionId: text('selection_id').notNull().references(() => selectionAttributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    value: text('value').notNull(),
    selected: boolean('selected').notNull().$default(() => false),
}

export const selectionOptionsAttributes = pgTable('selection_option_attributes', columns);

export const selectionOptionsAttributesRelations = relations(selectionOptionsAttributes, ({ one }) => ({
    selection: one(selectionAttributes, { fields: [selectionOptionsAttributes.selectionId], references: [selectionAttributes.id] }),
}));
