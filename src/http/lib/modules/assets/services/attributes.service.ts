import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AttributesRepository } from "../repositories/attributes.repository";
import { Attribute, AttributeWithValues, CreateAttribute, createAttributeSchema } from "../schemas/attributes.schema";
import { v4 as uuidv4 } from "uuid";

export class AttributesService {
    constructor(private readonly attributesRepository: AttributesRepository) {}

    async updateAttribute(id: string, data: Partial<Attribute>): Promise<Attribute | null> {
        if (!id) throw new BadRequestError('Attribute ID is required', 400);
        if (!data || Object.keys(data).length === 0) throw new BadRequestError('No update data provided', 400);
        const result = await this.attributesRepository.updateAttribute(id, data);
        if (!result) throw new InternalServerError('Failed to update attribute');
        return result;
    }

    async deleteAttribute(id: string): Promise<Attribute | null> {
        if (!id) throw new BadRequestError('Attribute ID is required', 400);
        const result = await this.attributesRepository.deleteAttribute(id);
        if (!result) throw new InternalServerError('Failed to delete attribute');
        return result;
    }

    async updateAttributeValue(id: string, data: Partial<any>): Promise<any | null> {
        if (!id) throw new BadRequestError('Attribute value ID is required', 400);
        if (!data || Object.keys(data).length === 0) throw new BadRequestError('No update data provided', 400);
        const result = await this.attributesRepository.updateAttributeValue(id, data);
        if (!result) throw new InternalServerError('Failed to update attribute value');
        return result;
    }

    async deleteAttributeValue(id: string): Promise<any | null> {
        if (!id) throw new BadRequestError('Attribute value ID is required', 400);
        const result = await this.attributesRepository.deleteAttributeValue(id);
        if (!result) throw new InternalServerError('Failed to delete attribute value');
        return result;
    }

    async getAttributeById(id: string): Promise<AttributeWithValues | null> {
        const result = await this.attributesRepository.getAttributeById(id);
        if (!result) throw new BadRequestError(`Attribute with id ${id} not found`, 404);
        const attributeWithValues: AttributeWithValues = {
            ...result[0].attributes,
            values: []
        };

        for (const row of result) {
            if (row.attribute_values && row.attribute_values.id) {
                attributeWithValues.values.push(row.attribute_values);
            }
        }

        return attributeWithValues;
    }

    async getAllAttributes(): Promise<AttributeWithValues[]> {
        const result = await this.attributesRepository.getAllAttributes();
        if (!result) throw new InternalServerError("Failed to fetch attributes");
        if (result.length === 0) return [];
        // Aggregate all attribute values for each attribute
        const attributeMap = new Map<string, AttributeWithValues>();
        for (const row of result) {
            const attrId = row.attributes.id;
            if (!attributeMap.has(attrId)) {
                attributeMap.set(attrId, { ...row.attributes, values: [] });
            }
            if (row.attribute_values && row.attribute_values.id) {
                attributeMap.get(attrId)!.values.push(row.attribute_values);
            }
        }
        return Array.from(attributeMap.values());
    }

    async createAttribute(data: CreateAttribute): Promise<Attribute> {
        const dataValidation = createAttributeSchema.safeParse(data);
        if (!dataValidation.success) throw new BadRequestError('Invalid attribute data', 400);
        const { name, description, organizationId, authorId, type } = data;
        const result = await this.attributesRepository.createAttribute({
            id: uuidv4(),
            name,
            description: description || "Default description",
            organizationId: organizationId,
            authorId,
            type,
            options: data.options || null,
            unit: data.unit || null,
            timeUnit: data.timeUnit || null,
            trashBin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            required: false
        });
        if (!result) throw new InternalServerError("Failed to create attribute");
        return result;
    }

    async createAttributeValue(data: any): Promise<any> {
        // Validate input (can use Zod schemas for each type if needed)
        if (!data.assetId || !data.attributeId || typeof data.value === 'undefined') {
            throw new BadRequestError('Invalid attribute value data', 400);
        }
        // Optionally validate type/unit/options here
        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId: data.assetId,
            attributeId: data.attributeId,
            value: data.value
        };
        const result = await this.attributesRepository.createAttributeValue(valueData);
        if (!result) throw new InternalServerError("Failed to create attribute value");
        return result;
    }

    // Deprecated: use createAttributeValue for all types

}