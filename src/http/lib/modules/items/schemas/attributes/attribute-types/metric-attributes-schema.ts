import { pgEnum, pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { MetricUnit } from "../../../definitions/enum/metric-unit-enum.ts";
import { attributes } from "../attributes-schema.ts";
import { relations } from "drizzle-orm";

export const metricUnitEnum  = pgEnum("metric_unit", Object.values(MetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').primaryKey().$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').references(() => attributes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    value: real('value').notNull(),
    metric_unit: metricUnitEnum('metric_unit').notNull(),
}

export const metricAttributes = pgTable('metric_attributes', columns);

export const metricAttributesRelations = relations(metricAttributes, ({ one }) => ({
    attribute: one(attributes, { fields: [metricAttributes.attributeId], references: [attributes.id] }),
}));
