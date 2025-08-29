import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AttributesRepository } from "../repositories/attributes.repository";
import { AttributeValue, CreateAttributeValue, createAttributeValueSchema, CreateDateValue, createDateValueSchema, CreateMetricValue, createMetricValueSchema, CreateNumberValue, createNumberValueSchema, CreateTextValue, createTextValueSchema } from "../schemas/attribute-values.schema";
import { Attribute, AttributeWithValues, CreateAttribute, createAttributeSchema } from "../schemas/attributes.schema";
import { v4 as uuidv4 } from "uuid";

export class AttributesService {
    constructor(private readonly attributesRepository: AttributesRepository) {}

    async getAttributeById(id: string): Promise<AttributeWithValues | null> {
        const result = await this.attributesRepository.getAttributeById(id);
        if (!result) throw new BadRequestError(`Attribute with id ${id} not found`, 404);
        const attributeWithValues: AttributeWithValues = {
            ...result[0].attributes,
            values: []
        };

        for (const row of result) {
            // If this row has a value (from the left join), add it to values array
            if (row.number_values) {
                const value = row.number_values;
                if (attributeWithValues) attributeWithValues.values.push(value);
            }
        }

        return attributeWithValues;
    }

    async getAllAttributes(): Promise<AttributeWithValues[]> {
        const result = await this.attributesRepository.getAllAttributes();
        if (!result) throw new InternalServerError("Failed to fetch attributes");
        if (result.length === 0) return [];
        // Process attributes with their values from the left join
        const attributeList: AttributeWithValues[] = [];

        for (const row of result) {
            if (!attributeList.some(attr => attr.id === row.attributes.id)) {
                // Create a new attribute entry
                const attribute = { ...row.attributes, values: [] } as AttributeWithValues;
                attributeList.push(attribute);
            }

            // If this row has a value (from the left join), add it to values array
            if (row.number_values) {
                const value = row.number_values;
                const attribute = attributeList.find(attr => attr.id === row.attributes.id);
                if (attribute) attribute.values.push(value);
            }
        }

        return attributeList;
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
            trashBin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        if (!result) throw new InternalServerError("Failed to create attribute");
        return result;
    }

    async createAttributeValue(data: any): Promise<any> {
        // Validate input (can use Zod schemas for each type if needed)
        if (!data.assetInstanceId || !data.attributeId || typeof data.value === 'undefined') {
            throw new BadRequestError('Invalid attribute value data', 400);
        }
        // Optionally validate type/unit/options here
        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId: data.assetInstanceId,
            attributeId: data.attributeId,
            value: data.value,
            metricUnit: data.metricUnit,
            timeUnit: data.timeUnit
        };
        const result = await this.attributesRepository.createAttributeValue(valueData);
        if (!result) throw new InternalServerError("Failed to create attribute value");
        return result;
    }

    // Deprecated: use createAttributeValue for all types

}