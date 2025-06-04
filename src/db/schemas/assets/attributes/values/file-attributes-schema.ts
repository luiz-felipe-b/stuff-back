import { pgTable, real, text } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    attributeId: text('attribute_id').notNull(),
    link: text('value').notNull(),
}

export const fileAttributes = pgTable('file_attributes', columns);
