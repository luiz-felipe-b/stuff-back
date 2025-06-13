import { z } from "zod";

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
    attributeType: z.enum(["text", "number", "boolean", "metric", "date", "select"]),
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

export const textValueSchema = attributeValueSchema.extend({
    value: z.string(),
});

export const createTextValueSchema = textValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    attributeType: z.literal("text"),
});

export type TextValue = z.infer<typeof textValueSchema>;
export type CreateTextValue = z.infer<typeof createTextValueSchema>;

export const dateValueSchema = attributeValueSchema.extend({
    value: z.date(),
});
export const createDateValueSchema = dateValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    attributeType: z.literal("date"),
    value: z.string(),
});

export type DateValue = z.infer<typeof dateValueSchema>;
export type CreateDateValue = z.infer<typeof createDateValueSchema>;

export const metricValueSchema = attributeValueSchema.extend({
    value: z.number(),
    metricUnit: z.string(),
});

export const createMetricValueSchema = metricValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    attributeType: z.literal("metric"),
});

export type MetricValue = z.infer<typeof metricValueSchema>;
export type CreateMetricValue = z.infer<typeof createMetricValueSchema>;