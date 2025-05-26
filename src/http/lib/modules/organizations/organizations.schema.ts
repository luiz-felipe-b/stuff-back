import { z } from 'zod';

export const organizationSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    active: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Organization = z.infer<typeof organizationSchema>;

export const createOrganizationSchema = z.object({
    name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
    slug: z.string({ message: 'Slug is required' }).min(1, { message: 'Slug is required' }),
    description: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    ownerId: z.string({ message: 'Owner ID is required' }).min(1, { message: 'Owner ID is required' }),
});

export type CreateOrganization = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = organizationSchema.partial().omit({
    id: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
});

export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;

export const publicOrganizationSchema = organizationSchema.omit({
    password: true,
    ownerId: true,
})

export type PublicOrganization = z.infer<typeof publicOrganizationSchema>;

export const organizationIdentifierParamSchema = z.object({
    identifier: z.string({ message: 'Identifier needs to be a string' }).min(1, { message: 'Identifier is required' }),
});

export const organizationIdParamSchema = z.object({
    id: z.string({ message: 'Id is needed.' }).uuid({ message: 'Id must be a valid UUID.' }),
});