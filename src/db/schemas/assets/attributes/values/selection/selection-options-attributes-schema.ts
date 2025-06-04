import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    selectionId: text('selection_id').notNull(),
    value: text('value').notNull(),
    selected: boolean('selected').notNull(),
}

export const selectionOptionsAttributes = pgTable('selection_option_attributes', columns);
