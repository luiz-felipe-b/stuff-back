import { Database, Transaction } from "../../../../../types/db/database";
import { attributes } from "../../../../../db/schemas/assets/attributes/attributes.schema";
import { Attribute } from "../schemas/attributes.schema";
import { attributeValues } from "../../../../../db/schemas/assets/attributes/attribute-values.schema";
import { eq, or } from "drizzle-orm";


export class AttributesRepository {
    constructor(private readonly db: Database | Transaction) {}

    async updateAttribute(id: string, data: Partial<Attribute>): Promise<Attribute | null> {
        const [result] = await this.db
            .update(attributes)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(attributes.id, id))
            .returning() as Attribute[];
        return result ?? null;
    }

    async deleteAttribute(id: string): Promise<Attribute | null> {
        await this.db.delete(attributeValues).where(eq(attributeValues.attributeId, id));
        const [result] = await this.db
            .delete(attributes)
            .where(eq(attributes.id, id))
            .returning() as Attribute[];
        return result ?? null;
    }

    async updateAttributeValue(id: string, data: Partial<any>): Promise<any | null> {
        const [result] = await this.db
            .update(attributeValues)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(attributeValues.id, id))
            .returning();
        return result ?? null;
    }

    async deleteAttributeValue(id: string): Promise<any | null> {
        const [result] = await this.db
            .delete(attributeValues)
            .where(eq(attributeValues.id, id))
            .returning();
        return result ?? null;
    }
    

    async createAttribute(data: Attribute): Promise<Attribute> {
        const [result] = await this.db
            .insert(attributes)
            .values(data)
            .returning() as Attribute[];
        return result;
    }

    async createAttributeValue(data: any): Promise<any> {
        console.log(data)
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