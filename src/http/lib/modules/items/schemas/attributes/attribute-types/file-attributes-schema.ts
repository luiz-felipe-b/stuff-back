import { pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    link: text('value').notNull(),
}

export const fileAttributes = pgTable('file_attributes', columns);
