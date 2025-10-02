import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";

export const aiFunctionalitiesRoutesDocs = {
    describeImage: {
        description: "Send an image (base64) and prompt to Bedrock Nova Lite/Claude 3 and get a description.",
        tags: ["ai-functionalities"],
        body: z.object({
            imageBase64: z.string().min(1).describe("Image as base64 string (PNG recommended)"),
            prompt: z.string().optional().describe("Prompt for the image description")
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default("Image description received"),
                data: z.string().describe("Image description from Claude")
            }),
            400: commonErrorResponses[400],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500]
        },
        security: [{ bearerAuth: [] }]
    }
};
