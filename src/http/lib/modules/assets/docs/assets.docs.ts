import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";
import { assetSchema, assetWithAttributesSchema, createAssetSchema } from "../schemas/assets.schema";

export const assetRouteDocs = {
    getAllAssets: {
        description: 'Get all assets',
        tags: ['assets'],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Assets found'),
                data: z.object({
                    assets_instances: z.array(assetSchema)
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
                data: assetWithAttributesSchema
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
        body: createAssetSchema.omit({ creatorUserId: true }).describe('Asset instance creation schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Assets found'),
                data: z.array(assetSchema)
            }).describe('Assets found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
}