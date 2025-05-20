import { z } from "zod";
import { commonErrorResponses, commonSuccessResponses } from "../../../../../types/http/responses";
import { organizationSchema, publicOrganizationSchema } from "../organizations.schema";

export const organizationRouteDocs = {
    getAllOrganizations: {
        description: 'Get all organizations',
        tags: ['organizations'],
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organizations found'),
                data: z.array(organizationSchema)
            }).describe('Organizations found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }]
    },

    getOrganizationByIdentifier: {
        description: 'Get organization by an identifier, could be the organization ID or slug',
        tags: ['organizations'],
        params: z.object({
            identifier: z.string({ message: 'Identifier needs to be a string' }).min(1, { message: 'Identifier is required' })
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organization found'),
                data: publicOrganizationSchema
            }).describe('Organization found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    createOrganization: {
        description: 'Create organization',
        tags: ['organizations'],
        headers: z.object({
            authorization: z.string({ message: 'Authorization header is required' }).min(1, { message: 'Authorization header is required' })
        }),
        body: z.object({
            name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
            slug: z.string({ message: 'Slug is required' }).min(1, { message: 'Slug is required' }),
            description: z.string().optional(),
            password: z.string().optional(),
        }),
        response: {
            201: commonSuccessResponses[201].extend({
                message: z.string().default('Organization created'),
                data: publicOrganizationSchema
            }).describe('Organization created'),
            400: commonErrorResponses[400],
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    updateOrganization: {
        description: 'Update organization',
        tags: ['organizations', 'to-do'],
    },

    deleteOrganization: {
        description: 'Delete organization',
        tags: ['organizations', 'to-do'],
    }
}
