import { z } from "zod";

export const assetInstanceSchema = z.object({
    id: z.string().uuid({ message: "ID must be a valid UUID" }),
    organizationId: z.string({ message: "Organization ID is required" }).min(1, { message: "Organization ID is required" }).uuid({ message: "Organization ID must be a valid UUID" }).nullable(),
    templateId: z.string().uuid({ message: "Template ID must be a valid UUID" }).nullable(),
    creatorUserId: z.string({ message: "Creator User ID is required." }).uuid({ message: "Creator User ID must be a valid UUID" }),
    name: z.string(),
    description: z.string().nullable(),
    trashBin: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type AssetInstance = z.infer<typeof assetInstanceSchema>;

export const createAssetInstanceSchema = assetInstanceSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    trashBin: true,
}).extend({
    templateId: z.string().uuid({ message: "Template ID must be a valid UUID" }).optional(),
    organizationId: z.string().min(1, { message: "Organization ID is required" }).uuid({ message: "Organization ID must be a valid UUID" }).optional(),
    description: z.string().optional(),
});

export type CreateAssetInstance = z.infer<typeof createAssetInstanceSchema>;
        
