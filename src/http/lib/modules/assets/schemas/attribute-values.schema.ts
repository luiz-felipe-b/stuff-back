
import { z } from "zod";


export const attributeValueSchema = z.object({
    id: z.string().uuid(),
    assetInstanceId: z.string().uuid(),
    attributeId: z.string().uuid(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type AttributeValue = z.infer<typeof attributeValueSchema>;