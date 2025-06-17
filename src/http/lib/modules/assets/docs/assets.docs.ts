import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";
import { assetInstanceSchema, assetInstanceWithAttributesSchema, createAssetInstanceSchema } from "../schemas/assets-instances.schema";
import { assetTemplateSchema } from "../schemas/assets-templates.schema";

export const assetRouteDocs = {
    getAllAssets: {
        description: 'Get all assets',
        tags: ['assets'],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Assets found'),
                data: z.object({
                    assets_templates: z.array(assetTemplateSchema),
                    assets_instances: z.array(assetInstanceSchema)
                })
            }).describe('Assets found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    getAssetById: {
        description: 'Get asset by ID',
        tags: ['assets'],
        params: z.object({
            id: z.string({ message: 'Asset ID is required' }).min(1, { message: 'Asset ID is required' })
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Asset found'),
                data: assetInstanceWithAttributesSchema
            }).describe('Asset found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    createAssetInstance: {
        description: 'Create an asset instance',
        tags: ['assets'],
        body: createAssetInstanceSchema.omit({ creatorUserId: true }).describe('Asset instance creation schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Assets found'),
                data: z.array(assetInstanceSchema)
            }).describe('Assets found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
}