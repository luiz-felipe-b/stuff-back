import { pgEnum, pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { MetricUnit } from "../../../definitions/enum/metric-unit-enum.ts";

const metricUnitEnum  = pgEnum("metric_unit", Object.values(MetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: real('value').notNull(),
    metric_unit: metricUnitEnum('metric_unit').notNull(),
}

export const metricAttributes = pgTable('metric_attributes', columns);
