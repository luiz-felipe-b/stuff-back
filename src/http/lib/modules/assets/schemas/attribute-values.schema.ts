
import { z } from "zod";


export const attributeValueSchema = z.object({
    id: z.string().uuid(),
    assetInstanceId: z.string().uuid(),
    attributeId: z.string().uuid(),
    value: z.string(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export type AttributeValue = z.infer<typeof attributeValueSchema>;