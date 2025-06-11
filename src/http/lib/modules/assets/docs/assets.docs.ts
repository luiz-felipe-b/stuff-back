import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";
import { assetInstanceSchema, createAssetInstanceSchema } from "../schemas/assets-instances.schema";
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