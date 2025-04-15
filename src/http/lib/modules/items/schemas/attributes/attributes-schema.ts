import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from '../../../../../../db/schemas/organizations.schema.ts';
import { users } from '../../../users/schemas/users-schema.ts';
import { nanoid } from 'nanoid';
import { relations } from 'drizzle-orm';

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    authorId: text('author_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type').notNull(),
    trashBin: boolean('trash_bin').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
};

export const attributes = pgTable('attributes', columns);

export const attributesRelations = relations(attributes, ({ one }) => ({
    organization: one(organizations, { fields: [attributes.organizationId], references: [organizations.id] }),
    author: one(users, { fields: [attributes.authorId], references: [users.id] }),
}))
