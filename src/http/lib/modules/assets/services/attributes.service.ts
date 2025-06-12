import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AttributesRepository } from "../repositories/attributes.repository";
import { Attribute, AttributeValue, AttributeWithValues, CreateAttribute, createAttributeSchema, CreateAttributeValue, createAttributeValueSchema, CreateNumberValue, createNumberValueSchema } from "../schemas/attributes.schema";
import { v4 as uuidv4 } from "uuid";

export class AttributesService {
    private attributeValuesRepositories: Record<string, (data: any) => Promise<AttributeValue>>;

    constructor(private readonly attributesRepository: AttributesRepository) {
        this.attributeValuesRepositories = {
            // text: this.attributesRepository.createTextValue,
            number: this.createNumberValue.bind(this),
            // boolean: this.attributesRepository.createBooleanValue,
            // date: this.attributesRepository.createDateValue,
            // select: this.attributesRepository.createSelectValue, 
        }
    }

    async getAttributeById(id: string): Promise<Attribute | null> {
        const result = await this.attributesRepository.getAttributeById(id);
        if (!result) throw new BadRequestError(`Attribute with id ${id} not found`, 404);
        return result;
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
        const attribute = await this.attributesRepository.getAttributeById(bodyValidation.data.attributeId);
        if (!attribute) throw new BadRequestError(`Attribute with id ${bodyValidation.data.attributeId} not found`, 404);
        if (attribute.type !== attributeType) throw new BadRequestError(`Attribute type mismatch: expected ${attribute.type}, got ${attributeType}`, 400);

        if (!this.attributeValuesRepositories[attributeType]) {
            throw new BadRequestError(`Attribute type ${attributeType} is not supported`, 400);
        }
        const createValueFunction = this.attributeValuesRepositories[attributeType];
        const valueData = {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...bodyValidation.data
        };
        const result = await createValueFunction(valueData);

        if (!result) throw new InternalServerError("Failed to create attribute value");
        return result;
    }

    async createNumberValue(data: CreateNumberValue): Promise<AttributeValue> {
        const bodyValidation = createNumberValueSchema.safeParse(data);
        console.log(data);
        console.log(bodyValidation.error?.issues[0].path);
        if (!bodyValidation.success) throw new BadRequestError('Invalid number value data', 400);
        const { assetInstanceId, attributeId, value } = bodyValidation.data;

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

}