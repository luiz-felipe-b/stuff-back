import { z } from "zod";

export const assetTemplateSchema = z.object({
    id: z.string().uuid({ message: "ID must be a valid UUID" }),
    organizationId: z.string({ message: "Organization ID is required" }).min(1, { message: "Organization ID is required" }).uuid({ message: "Organization ID must be a valid UUID" }).nullable(),
    name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
    description: z.string().nullable(),
    trashBin: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
    creatorUserId: z.string({ message: "Creator User ID is required." }).uuid({ message: "Creator User ID must be a valid UUID" }),
});

export type AssetTemplate = z.infer<typeof assetTemplateSchema>;

export const createAssetTemplateSchema = assetTemplateSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    trashBin: true,
}).extend({
    creatorUserId: z.string({ message: "Creator User ID is required." }).uuid({ message: "Creator User ID must be a valid UUID" }),
    organizationId: z.string().min(1, { message: "Organization ID is required" }).uuid({ message: "Organization ID must be a valid UUID" }).optional(),
    templateId: z.string().uuid({ message: "Template ID must be a valid UUID" }).optional(),
    description: z.string().optional(),
});

export type CreateAssetTemplate = z.infer<typeof createAssetTemplateSchema>;