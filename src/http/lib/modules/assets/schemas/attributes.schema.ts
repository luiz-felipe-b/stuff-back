import { z } from "zod";
import { attributeValueSchema } from "./attribute-values.schema";

export const attributeSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["text", "number", "boolean", "date", "metric", "select"]),
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