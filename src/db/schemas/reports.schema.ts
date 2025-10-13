import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { users } from "./users.schema.ts";
import { relations } from "drizzle-orm/relations";
import { organizations } from "./organizations.schema.ts";


const columns = {
    id: uuid('id').$defaultFn(() => uuidv4()).notNull().primaryKey(),
    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
    organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    file_url: text('file_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const reports = pgTable('reports', columns);

export const reportsRelations = relations(reports, ({ one, many }) => ({
    author: one(users, { fields: [reports.authorId], references: [users.id] }),
    organization: one(organizations, { fields: [reports.organizationId], references: [organizations.id] }),
}));
