import { pgTable, text } from "drizzle-orm/pg-core";
import { itemTemplates } from "../items/items-templates-schema";
import { itemInstances } from "../items/items-instances-schema";
import { attributes } from "../attributes/attributes-schema";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

export const itemsToAttributes = pgTable('items_to_attributes', {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    templateId: text('item_id').notNull().references(() => itemTemplates.id),
    instanceId: text('instance_id').notNull().references(() => itemInstances.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
})

export const itemsToAttributesRelations = relations(itemsToAttributes, ({ one }) => ({
    itemTemplates: one(itemTemplates, { fields: [itemsToAttributes.templateId], references: [itemTemplates.id] }),
    itemInstances: one(itemInstances, { fields: [itemsToAttributes.instanceId], references: [itemInstances.id] }),
    attributes: one(attributes, { fields: [itemsToAttributes.attributeId], references: [attributes.id] }),
}))
