import { pgEnum, pgTable, real, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { TimeMetricUnit } from "../../../definitions/enum/time-metric-unit-enum.ts";

const timeMetricUnitEnum  = pgEnum("metric_unit", Object.values(TimeMetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').$defaultFn(() => nanoid()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: real('value').notNull(),
    metric_unit: timeMetricUnitEnum('metric_unit').notNull(),
}

export const timeMetricAttributes = pgTable('time_metric_attributes', columns);
