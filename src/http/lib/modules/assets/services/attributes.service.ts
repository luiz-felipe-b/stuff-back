import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AttributesRepository } from "../repositories/attributes.repository";
import { AttributeValue, CreateAttributeValue, createAttributeValueSchema, CreateDateValue, createDateValueSchema, CreateMetricValue, createMetricValueSchema, CreateNumberValue, createNumberValueSchema, CreateTextValue, createTextValueSchema } from "../schemas/attribute-values.schema";
import { Attribute, AttributeWithValues, CreateAttribute, createAttributeSchema } from "../schemas/attributes.schema";
import { v4 as uuidv4 } from "uuid";

export class AttributesService {
    private attributeValuesRepositories: Record<string, (data: any) => Promise<AttributeValue>>;

    constructor(private readonly attributesRepository: AttributesRepository) {
        this.attributeValuesRepositories = {
            text: this.createTextValue.bind(this),
            number: this.createNumberValue.bind(this),
            // boolean: this.attributesRepository.createBooleanValue,
            date: this.createDateValue.bind(this),
            metric: this.createMetricValue.bind(this),
            // select: this.attributesRepository.createSelectValue, 
        }
    }

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

    async createAttributeValue(data: CreateAttributeValue): Promise<Omit<AttributeValue, 'attributeType'>> {
        const bodyValidation = createAttributeValueSchema.safeParse(data);
        if (!bodyValidation.success) throw new BadRequestError('Invalid attribute value data', 400);
        const { attributeType } = bodyValidation.data;
        const attribute = await this.getAttributeById(bodyValidation.data.attributeId);
        if (!attribute) throw new BadRequestError(`Attribute with id ${bodyValidation.data.attributeId} not found`, 404);
        if (attribute.type !== attributeType) throw new BadRequestError(`Attribute type mismatch: expected ${attribute.type}, got ${attributeType}`, 400);
        if (!this.attributeValuesRepositories[attributeType]) {
            throw new BadRequestError(`Attribute type ${attributeType} is not supported`, 400);
        }
        const createValueFunction = this.attributeValuesRepositories[attributeType];
        const result = await createValueFunction(data);

        if (!result) throw new InternalServerError("Failed to create attribute value");
        return result;
    }

    async createNumberValue(data: CreateNumberValue): Promise<AttributeValue> {
        const bodyValidation = createNumberValueSchema.safeParse(data);
        if (!bodyValidation.success) throw new BadRequestError('Invalid number value data', 400);
        const { assetInstanceId, attributeId, value } = bodyValidation.data;
        if (typeof value !== 'number') throw new BadRequestError('Value must be a number', 400);

        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId,
            attributeId,
            value
        };
        const result = await this.attributesRepository.createNumberValue(valueData);

        if (!result) throw new InternalServerError("Failed to create number value");
        return result;
    }

    async createTextValue(data: CreateTextValue): Promise<AttributeValue> {
        const bodyValidation = createTextValueSchema.safeParse(data);
        if (!bodyValidation.success) throw new BadRequestError('Invalid text value data', 400);
        const { assetInstanceId, attributeId, value } = bodyValidation.data;

        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId,
            attributeId,
            value
        };
        const result = await this.attributesRepository.createTextValue(valueData);

        if (!result) throw new InternalServerError("Failed to create text value");
        return result;
    }

    async createDateValue(data: CreateDateValue): Promise<AttributeValue> {
        const bodyValidation = createDateValueSchema.safeParse(data);
        if (!bodyValidation.success) throw new BadRequestError('Invalid date value data', 400);
        const { assetInstanceId, attributeId, value } = bodyValidation.data;
        const parsedDate = new Date(value);
        console.log('value', value);
        console.log('parsedDate', parsedDate);
        if (isNaN(parsedDate.getTime())) throw new BadRequestError('Invalid date value', 400);
        if (parsedDate.toString() === 'Invalid Date') throw new BadRequestError('Invalid date value', 400);
        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId,
            attributeId,
            value: parsedDate
        };
        const result = await this.attributesRepository.createDateValue(valueData);
        if (!result) throw new InternalServerError("Failed to create date value");
        return result;
    }

    async createMetricValue(data: CreateMetricValue): Promise<AttributeValue> {
        const bodyValidation = createMetricValueSchema.safeParse(data);
        console.log('bodyValidation', bodyValidation);
        console.log(data)
        if (!bodyValidation.success) throw new BadRequestError('Invalid metric value data', 400);
        const { assetInstanceId, attributeId, value, metricUnit } = bodyValidation.data;
        if (typeof value !== 'number') throw new BadRequestError('Value must be a number', 400);

        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            assetInstanceId,
            attributeId,
            value,
            metricUnit
        };
        const result = await this.attributesRepository.createMetricValue(valueData);

        if (!result) throw new InternalServerError("Failed to create metric value");
        return result;
    }

}