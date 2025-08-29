import { Database, Transaction } from "../../../../../types/db/database";
import { attributes } from "../../../../../db/schemas/assets/attributes/attributes.schema";
import { Attribute } from "../schemas/attributes.schema";
import { attributeValues } from "../../../../../db/schemas/assets/attributes/attribute-values.schema";
import { eq, or } from "drizzle-orm";
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

    async createAttributeValue(data: any): Promise<any> {
        const [result] = await this.db
            .insert(attributeValues)
            .values(data)
            .returning();
        return result;
    }

    async getAttributeById(id: string): Promise<any[] | null> {
        const result = await this.db
            .select()
            .from(attributes)
            .where(eq(attributes.id, id))
            .leftJoin(attributeValues, eq(attributes.id, attributeValues.attributeId));
        return result.length > 0 ? result : null;
    }

    async getAllAttributes(): Promise<any[]> {
        const result = await this.db
            .select()
            .from(attributes)
            .leftJoin(attributeValues, eq(attributes.id, attributeValues.attributeId));
        return result;
    }
}