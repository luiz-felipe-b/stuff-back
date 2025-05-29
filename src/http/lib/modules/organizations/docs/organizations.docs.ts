import { z } from "zod";
import { commonErrorResponses, commonSuccessResponses } from "../../../../../types/http/responses";
import { organizationIdParamSchema, organizationSchema, publicOrganizationSchema, updateOrganizationSchema } from "../organizations.schema";
import { publicUserSchema } from "../../users/user.schema";

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
        tags: ['organizations'],
        params: organizationIdParamSchema,
        body: updateOrganizationSchema,
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organization updated successfully'),
                data: publicOrganizationSchema
            }).describe('Organization updated successfully'),
            400: commonErrorResponses[400],
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    deleteOrganization: {
        description: 'Delete organization',
        tags: ['organizations'],
        params: organizationIdParamSchema,
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organization deleted successfully'),
                data: z.string().optional()
            }).describe('Organization deleted successfully'),
            400: commonErrorResponses[400],
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    getOrganizationMembers: {
        description: 'Get organization members',
        tags: ['organizations'],
        params: organizationIdParamSchema,
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organization members found'),
                data: z.array(publicUserSchema.omit({
                    authenticated: true}))
            }).describe('Organization members found'),
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    addOrganizationMember: {
        description: 'Add member to organization',
        tags: ['organizations'],
        params: organizationIdParamSchema,
        body: z.object({
            userId: z.string({ message: 'User ID is required' }).min(1, { message: 'User ID is required' }),
            role: z.enum(['admin', 'moderator', 'user'], {
                message: 'Role must be one of the following: admin, moderator, user'
            }).default('user'),
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Member added to organization'),
                data: z.object({
                    userId: z.string(),
                    role: z.enum(['admin', 'moderator', 'user']),
                    organizationId: z.string(),
                    createdAt: z.date(),
                    updatedAt: z.date(),
                })
            }).describe('Member added to organization'),
            400: commonErrorResponses[400],
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },

    updateOrganizationMember: {
        description: 'Update organization member role',
        tags: ['organizations'],
        params: z.object({
            id: z.string({ message: 'Organization ID is required' }).min(1, { message: 'Organization ID is required' }),
            userId: z.string({ message: 'User ID is required' }).min(1, { message: 'User ID is required' })
        }),
        body: z.object({
            role: z.enum(['admin', 'moderator', 'user'], {
                message: 'Role must be one of the following: admin, moderator, user'
            }).default('user'),
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default('Organization member role updated'),
                data: z.object({
                    userId: z.string(),
                    organizationId: z.string(),
                    role: z.enum(['admin', 'moderator', 'user']),
                    updatedAt: z.date(),
                })
            }).describe('Organization member role updated'),
            400: commonErrorResponses[400],
            403: commonErrorResponses[403],
            401: commonErrorResponses[401],
            404: commonErrorResponses[404],
            500: commonErrorResponses[500],
        },
        security: [{ bearerAuth: [] }],
    },
}
