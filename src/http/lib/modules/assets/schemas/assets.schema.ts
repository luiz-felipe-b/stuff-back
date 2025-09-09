import { z } from "zod";
import { assetTypes } from "../types/asset-types"
import { attributeWithValuesSchema } from "./attributes.schema";

export const assetTypesEnum = z.enum(assetTypes);
export type AssetTypes = z.infer<typeof assetTypesEnum>;

// Asset schema
export const assetSchema = z.object({
    id: z.string().uuid(),
    type: assetTypesEnum,
    quantity: z.number().int().nullable(),
    organizationId: z.string().uuid().nullable().optional(),
    creatorUserId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable().optional(),
    trashBin: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type Asset = z.infer<typeof assetSchema>;

// Asset with attributes and values
export const assetWithAttributesSchema = assetSchema.extend({
    attributes: z.array(attributeWithValuesSchema).default([])
});
export type AssetWithAttributes = z.infer<typeof assetWithAttributesSchema>;

export const createAssetSchema = assetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    trashBin: true,
}).extend({
    description: z.string().optional(),
    quantity: z.number().int().optional(),
    templateId: z.string().uuid().optional().nullable(),
});
export type CreateAsset = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = createAssetSchema.partial().omit({ creatorUserId: true, organizationId: true, type: true });
export type UpdateAsset = z.infer<typeof updateAssetSchema>;
