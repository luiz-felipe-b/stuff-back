import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: boolean('value').notNull(),
}

export const switchAttributes = pgTable('switch_attributes', columns);
