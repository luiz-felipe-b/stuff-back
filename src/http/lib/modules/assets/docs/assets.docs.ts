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
                    assets: z.array(assetWithAttributesSchema)
                })
            }).describe('Assets found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    getAllAssetsWithAttributes: {
        description: 'Get all assets with their attributes and values',
        tags: ['assets'],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Assets with attributes found'),
                data: z.object({
                    assets: z.array(assetWithAttributesSchema)
                })
            }).describe('Assets with attributes found'),
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
                data: assetSchema
            }).describe('Assets found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
    editAsset: {
        description: 'Edit asset by ID',
        tags: ['assets'],
        params: z.object({
            id: z.string({ message: 'Asset ID is required' }).uuid({ message: 'Asset ID must be a valid UUID' })
        }),
        body: createAssetSchema.partial().omit({ creatorUserId: true, organizationId: true, type: true }).describe('Asset edit schema'),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Asset updated'),
                data: assetSchema
            }).describe('Asset updated'),
            400: commonErrorResponses[400],
            401: commonErrorResponses[401],
            403: commonErrorResponses[403],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
    deleteAsset: {
        description: 'Delete asset by ID',
        tags: ['assets'],
        params: z.object({
            id: z.string({ message: 'Asset ID is required' }).uuid({ message: 'Asset ID must be a valid UUID' })
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Asset deleted'),
                data: z.object({ id: z.string().uuid() })
            }).describe('Asset deleted'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
    setAssetTrashBin: {
        description: 'Set the trashBin field for an asset',
        tags: ['assets'],
        params: z.object({
            id: z.string({ message: 'Asset ID is required' }).uuid({ message: 'Asset ID must be a valid UUID' })
        }),
        body: z.object({
            trashBin: z.boolean()
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Asset trashBin set'),
                data: assetSchema
            }).describe('Asset trashBin set'),
            400: commonErrorResponses[400],
            401: commonErrorResponses[401],
            403: commonErrorResponses[403],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },
}