import { TimeMetricUnit } from "../../../definitions/enum/time-metric-unit-enum";
import { Attribute } from "../attribute-model";

export interface TimeMetricAttribute extends Attribute {
    value: number;
    timeMetricUnit: TimeMetricUnit;
}
