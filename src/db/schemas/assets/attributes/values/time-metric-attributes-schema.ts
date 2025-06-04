import { pgEnum, pgTable, real, text } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { TimeMetricUnit } from "../../../../../http/lib/modules/assets/definitions/enum/time-metric-unit-enum.ts";

const timeMetricUnitEnum  = pgEnum("metric_unit", Object.values(TimeMetricUnit) as [string, ...string[]]);

const columns = {
    id: text('id').$defaultFn(() => uuidv4()).notNull(),
    attributeId: text('attribute_id').notNull(),
    value: real('value').notNull(),
    metric_unit: timeMetricUnitEnum('metric_unit').notNull(),
}

export const timeMetricAttributes = pgTable('time_metric_attributes', columns);
