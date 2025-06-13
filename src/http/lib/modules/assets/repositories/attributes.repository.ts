import { Database, Transaction } from "../../../../../types/db/database";
import { attributes } from "../../../../../db/schemas/assets/attributes/attributes.schema";
import { Attribute } from "../schemas/attributes.schema";
import { dateValues, metricUnitValues, numberValues, textValues } from "../../../../../db/schemas/assets/schemas";
import { eq } from "drizzle-orm";
import { DateValue, MetricValue, NumberValue, TextValue } from "../schemas/attribute-values.schema";


export class AttributesRepository {
    constructor(private readonly db: Database | Transaction) {}

    async createAttribute(data: Attribute): Promise<Attribute> {
        const [result] = await this.db
            .insert(attributes)
            .values(data)
            .returning() as Attribute[];
        return result;
    }

    async createNumberValue(data: NumberValue): Promise<NumberValue> {
        const [result] = await this.db
            .insert(numberValues)
            .values(data)
            .returning() as NumberValue[];
        return result;
    }

    async createTextValue(data: TextValue): Promise<TextValue> {
        const [result] = await this.db
            .insert(textValues)
            .values(data)
            .returning() as TextValue[];
        return result;
    }

    async createDateValue(data: DateValue): Promise<DateValue> {
        const [result] = await this.db
            .insert(dateValues)
            .values(data)
            .returning() as DateValue[];
        return result;
    }

    async createMetricValue(data: MetricValue): Promise<MetricValue> {
        const [result] = await this.db
            .insert(metricUnitValues)
            .values(data)
            .returning() as MetricValue[];
        return result;
    }

    async getAttributeById(id: string): Promise<{attributes: Attribute, number_values: NumberValue | null,  text_values: TextValue | null}[] | null> {
        const result = await this.db
            .select()
            .from(attributes)
            .where(eq(attributes.id, id))
            .leftJoin(numberValues, eq(attributes.id, numberValues.attributeId))
            .leftJoin(textValues, eq(attributes.id, textValues.attributeId));
        return result.length > 0 ? result as {attributes: Attribute, number_values: NumberValue | null,  text_values: TextValue | null}[]  : null;
    }

    async getAllAttributes(): Promise<{attributes: Attribute, number_values: NumberValue | null, text_values: TextValue | null}[]> {
        const result = await this.db
            .select()
            .from(attributes)
            .leftJoin(numberValues, eq(attributes.id, numberValues.attributeId))
            .leftJoin(textValues, eq(attributes.id, textValues.attributeId));
        return result as {attributes: Attribute, number_values: NumberValue | null,  text_values: TextValue | null}[];
    }
}