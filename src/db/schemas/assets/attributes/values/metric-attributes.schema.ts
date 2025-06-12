import { pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { MetricUnit } from "../../../../../http/lib/modules/assets/definitions/enum/metric-unit-enum.ts";
import { assetInstances } from "../../assets-instances.schema.ts";
import { attributes } from "../attributes.schema.ts";
import { relations } from "drizzle-orm";

export const metricUnitEnum = pgEnum("metric_unit", Object.values(MetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    assetInstanceId: text('asset_instance_id').notNull().references(() => assetInstances.id),
    attributeId: text('attribute_id').notNull().references(() => attributes.id),
    value: real('value').notNull(),
    metric_unit: metricUnitEnum('metric_unit').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

export const metricUnitValues = pgTable('metric_unit_values', columns);

export const metricUnitValuesRelations = relations(metricUnitValues, ({ one }) => ({
    assetInstance: one(assetInstances, { fields: [metricUnitValues.assetInstanceId], references: [assetInstances.id] }),
    attribute: one(attributes, { fields: [metricUnitValues.attributeId], references: [attributes.id] }),
}));
