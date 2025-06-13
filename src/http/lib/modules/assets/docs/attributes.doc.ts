import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";
import { assetInstanceSchema } from "../schemas/assets-instances.schema";
import { assetTemplateSchema } from "../schemas/assets-templates.schema";
import { createAttributeSchema } from "../schemas/attributes.schema";

export const attributesRoutesDocs = {
    getAllAttributes: {
        description: "Retrieve all attributes with their values.",
        tags: ["attributes"],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attributes found'),
                data: z.array(z.any())
            }).describe('Attributes found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    createAttribute: {
        description: "Create a new attribute.",
        tags: ["attributes"],
        body: createAttributeSchema.omit({ authorId: true }).describe('Attribute creation schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute created successfully'),
                data: z.object({
                    attribute: createAttributeSchema
                })
            }).describe('Attribute created successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    createAttributeValue: {
        description: "Create a value for an attribute.",
        tags: ["attributes"],
        params: z.object({
            attributeId: z.string().uuid().describe('ID of the attribute to create a value for')
        }).describe('Attribute ID parameter schema'),
        body: z.object({
            assetInstanceId: z.string().uuid(),
            value: z.any(),
            metricUnit: z.string().optional(),
            attributeType: z.enum(['number', 'text', 'boolean', 'date', 'metric', 'select']),
        }).describe('Attribute value creation schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute value created successfully'),
                data: z.object({
                    attributeValue: z.any() // This should be refined based on the attribute type
                })
            }).describe('Attribute value created successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    }
}