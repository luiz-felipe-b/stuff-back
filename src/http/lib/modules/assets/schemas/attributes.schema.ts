import { z } from "zod";

export const attributeSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["text", "number", "boolean", "date", "select"]),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    organizationId: z.string().uuid().optional(),
    authorId: z.string().uuid(),
    trashBin: z.boolean().default(false),
});

export const createAttributeSchema = attributeSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    trashBin: true,
});


export type Attribute = z.infer<typeof attributeSchema>;
export type CreateAttribute = z.infer<typeof createAttributeSchema>;

export const attributeValueSchema = z.object({
    id: z.string().uuid(),
    assetInstanceId: z.string().uuid(),
    attributeId: z.string().uuid(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export const createAttributeValueSchema = attributeValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    attributeType: z.enum(["text", "number", "boolean", "date", "select"]),
});

export type AttributeValue = z.infer<typeof attributeValueSchema>;
export type CreateAttributeValue = z.infer<typeof createAttributeValueSchema>;

export const numberValueSchema = attributeValueSchema.extend({
    value: z.number(),
});

export const createNumberValueSchema = numberValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    attributeType: z.literal("number"),
});

export type NumberValue = z.infer<typeof numberValueSchema>;
export type CreateNumberValue = z.infer<typeof createNumberValueSchema>;

export const attributeWithValuesSchema = attributeSchema.extend({
    values: z.array(attributeValueSchema.extend({
        value: z.union([
            z.string(),
            z.number(),
            z.boolean(),
            z.date(),
            z.array(z.string()), // For select type, assuming values are stored as an array of strings
        ]).optional(),
    })).optional().default([]),
});

export type AttributeWithValues = z.infer<typeof attributeWithValuesSchema>;