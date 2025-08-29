import { z } from "zod";
import { assetTypes } from "../types/asset-types"

export const assetTypesEnum = z.enum(assetTypes);
export type AssetTypes = z.infer<typeof assetTypesEnum>;

// Metric units
export const metricUnitEnum = z.enum([
    "ton", "kilogram", "gram", "kilometer", "meter", "centimeter", "square_meter", "cubic_meter", "mile", "feet", "degree", "liter"
]);
export type MetricUnit = z.infer<typeof metricUnitEnum>;

// Time metric units
export const timeMetricUnitEnum = z.enum([
    "second", "minute", "hour", "day", "week", "fortnight", "month", "year"
]);
export type TimeMetricUnit = z.infer<typeof timeMetricUnitEnum>;

// Attribute types
export const attributeTypeEnum = z.enum([
    "number", "text", "metric", "date", "switch", "selection", "multiselection", "file", "timemetric"
]);
export type AttributeType = z.infer<typeof attributeTypeEnum>;

// Selection option schema
export const attributeOptionSchema = z.object({
    id: z.string().uuid(),
    value: z.string(),
});
export type AttributeOption = z.infer<typeof attributeOptionSchema>;

// Attribute definition schema
export const attributeSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: attributeTypeEnum,
    unit: metricUnitEnum.optional(), // for metric
    timeUnit: timeMetricUnitEnum.optional(), // for timemetric
    options: z.array(attributeOptionSchema).optional(), // for selection/multiselection
    required: z.boolean().default(false),
    description: z.string().optional(),
});
export type Attribute = z.infer<typeof attributeSchema>;

// Asset schema
export const assetSchema = z.object({
    id: z.string().uuid(),
    type: assetTypesEnum,
    organizationId: z.string().uuid().nullable(),
    creatorUserId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    trashBin: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
    quantity: z.number().int().nullable(), // for replicable assets
});
export type Asset = z.infer<typeof assetSchema>;

// Asset attribute value schema
export const assetAttributeValueSchema = z.object({
    id: z.string().uuid(),
    assetId: z.string().uuid(),
    attributeId: z.string().uuid(),
    // value can be number, string, boolean, date, array, file url, etc.
    value: z.union([
        z.number(),
        z.string(),
        z.boolean(),
        z.date(),
        z.array(z.string()), // for multiselection
        z.object({ url: z.string().url() }), // for file
    ]),
    metricUnit: metricUnitEnum.optional(),
    timeUnit: timeMetricUnitEnum.optional(),
});
export type AssetAttributeValue = z.infer<typeof assetAttributeValueSchema>;

// Asset with attributes and values
export const assetWithAttributesSchema = assetSchema.extend({
    attributes: z.array(attributeSchema).default([]),
    values: z.array(assetAttributeValueSchema).default([]),
});
export type AssetWithAttributes = z.infer<typeof assetWithAttributesSchema>;

// Create asset schema
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

