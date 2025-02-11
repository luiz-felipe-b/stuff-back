import { pgEnum, pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { TimeMetricUnit } from "../../../definitions/enum/time-metric-unit-enum.ts";
import { attributes } from "../attributes-schema.ts";
import { relations } from "drizzle-orm";

export const timeMetricUnitEnum  = pgEnum("time_metric_unit", Object.values(TimeMetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull().references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    value: real('value').notNull(),
    metric_unit: timeMetricUnitEnum('metric_unit').notNull(),
}

export const timeMetricAttributes = pgTable('time_metric_attributes', columns);

export const timeMetricAttributesRelations = relations(timeMetricAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [timeMetricAttributes.attributeId], references: [attributes.id] }),
}));
