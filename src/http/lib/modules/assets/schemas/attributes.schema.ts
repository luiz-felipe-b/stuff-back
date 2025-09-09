import { z } from "zod";
import { attributeValueSchema } from "./attribute-values.schema";
import { attributeTypes } from "../types/attribute-types";
import { MetricUnit } from "../definitions/enum/metric-unit-enum";

export const attributeTypesEnum = z.enum(attributeTypes);
export type AttributeTypes = z.infer<typeof attributeTypesEnum>;

export const attributeSchema = z.object({
    id: z.string().uuid(),
    organizationId: z.string().uuid().nullable().optional(),
    authorId: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    type: attributeTypesEnum,
    unit: z.string().nullable().optional(),
    timeUnit: z.string().nullable().optional(),
    options: z.string().nullable().optional(),
    required: z.boolean().default(false),
    trashBin: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type Attribute = z.infer<typeof attributeSchema>;

export const createAttributeSchema = attributeSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    trashBin: true,
});
export type CreateAttribute = z.infer<typeof createAttributeSchema>;


export const attributeWithValuesSchema = attributeSchema.extend({
    values: z.array(attributeValueSchema).default([])
});

export type AttributeWithValues = z.infer<typeof attributeWithValuesSchema>;