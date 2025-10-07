import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";
import { attributeSchema, createAttributeSchema, attributeWithValuesSchema } from "../schemas/attributes.schema";

export const attributesRoutesDocs = {
    getAttributeById: {
        description: "Get a single attribute by ID, including its values.",
        tags: ["attributes"],
        params: z.object({
            attributeId: z.string().uuid().describe('ID of the attribute')
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute found'),
                data: attributeWithValuesSchema
            }).describe('Attribute found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    updateAttribute: {
        description: "Update an attribute by ID.",
        tags: ["attributes"],
        params: z.object({
            attributeId: z.string().uuid().describe('ID of the attribute to update')
        }),
        body: createAttributeSchema.partial().describe('Partial attribute update schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute updated successfully'),
                data: attributeSchema
            }).describe('Attribute updated successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    deleteAttribute: {
        description: "Delete an attribute by ID.",
        tags: ["attributes"],
        params: z.object({
            attributeId: z.string().uuid().describe('ID of the attribute to delete')
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute deleted successfully'),
                data: attributeSchema
            }).describe('Attribute deleted successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    updateAttributeValue: {
        description: "Update an attribute value by ID.",
        tags: ["attributes"],
        params: z.object({
            attributeValueId: z.string().uuid().describe('ID of the attribute value to update')
        }),
        body: z.object({
            value: z.any().optional(),
            metricUnit: z.string().optional(),
            timeUnit: z.string().optional(),
        }).partial().describe('Partial attribute value update schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute value updated successfully'),
                data: z.any()
            }).describe('Attribute value updated successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    deleteAttributeValue: {
        description: "Delete an attribute value by ID.",
        tags: ["attributes"],
        params: z.object({
            attributeValueId: z.string().uuid().describe('ID of the attribute value to delete')
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute value deleted successfully'),
                data: z.any()
            }).describe('Attribute value deleted successfully'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
    getAllAttributes: {
        description: "Retrieve all attributes with their values.",
        tags: ["attributes"],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attributes found'),
                data: z.array(attributeWithValuesSchema)
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
        body: createAttributeSchema.describe('Attribute creation schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Attribute created successfully'),
                data: attributeSchema.omit({
                        createdAt: true,
                        updatedAt: true,
                        trashBin: true,
                        authorId: true,
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
            assetId: z.string().uuid(),
            value: z.string()
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