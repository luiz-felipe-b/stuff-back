import { Database, Transaction } from "../../../../../types/db/database";
import { attributes } from "../../../../../db/schemas/assets/attributes/attributes.schema";
import { Attribute, NumberValue } from "../schemas/attributes.schema";
import { numberValues } from "../../../../../db/schemas/assets/schemas";
import { eq } from "drizzle-orm";


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

    async getAttributeById(id: string): Promise<any | null> {
        const result = await this.db
            .select()
            .from(attributes)
            .where(eq(attributes.id, id))
            .limit(1)
            .leftJoin(numberValues, eq(attributes.id, numberValues.attributeId));
        return result.length > 0 ? result[0] : null;
    }

    async getAllAttributes(): Promise<{attributes: Attribute, number_values: NumberValue | null}[]> {
        const result = await this.db
            .select()
            .from(attributes)
            .leftJoin(numberValues, eq(attributes.id, numberValues.attributeId));
        return result as {attributes: Attribute, number_values: NumberValue | null}[];
    }
}