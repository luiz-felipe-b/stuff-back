import { z } from 'zod';

export const organizationSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    logo: z.string().nullable().optional(),
    password: z.string().optional(),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Organization = z.infer<typeof organizationSchema>;

export const publicOrganizationSchema = organizationSchema.omit({
    password: true,
    ownerId: true,
})

export type PublicOrganization = z.infer<typeof publicOrganizationSchema>;