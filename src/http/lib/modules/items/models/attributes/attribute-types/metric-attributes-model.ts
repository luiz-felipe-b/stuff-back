import { MetricUnit } from "../../../definitions/enum/metric-unit-enum";
import { Attribute } from "../attribute-model";

export interface MetricAttribute extends Attribute {
    value: number;
    metric_unit: MetricUnit;
}
