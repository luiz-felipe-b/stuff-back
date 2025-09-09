
import { z } from "zod";

// value can be string, number, boolean, date, array, null
export const attributeValueSchema = z.object({
    id: z.string().uuid(),
    assetInstanceId: z.string().uuid(),
    attributeId: z.string().uuid(),
    value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.date(),
        z.array(z.string()),
        z.null()
    ]).nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type AttributeValue = z.infer<typeof attributeValueSchema>;