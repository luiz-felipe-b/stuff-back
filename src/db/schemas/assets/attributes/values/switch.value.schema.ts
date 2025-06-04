import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: boolean('value').notNull(),
}

export const switchAttributes = pgTable('switch_attributes', columns);
