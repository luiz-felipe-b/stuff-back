import { z } from "zod";
import { dateValueSchema, metricValueSchema, numberValueSchema, textValueSchema } from "./attribute-values.schema";
import { attributeTypes } from "../types/attribute-types";

export const attributeTypesEnum = z.enum(attributeTypes);
export type AttributeTypes = z.infer<typeof attributeTypesEnum>;

export const attributeSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
        type: attributeTypesEnum,
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    organizationId: z.string().uuid().optional().nullable(),
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
    values: z.array(z.union([
            numberValueSchema,
            textValueSchema, 
            dateValueSchema,
            metricValueSchema
        ])).default([])
});

export type AttributeWithValues = z.infer<typeof attributeWithValuesSchema>;