import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: timestamp('value').notNull(),
}

export const dateAttributes = pgTable('date_attributes', columns);
