import { z } from "zod";
import { commonSuccessResponses, commonErrorResponses } from "../../../../../types/http/responses";

export const aiRoutesDocs = {
    invokeNova: {
        description: "Send a prompt to Amazon Bedrock Nova Lite and get a response.",
        tags: ["ai"],
        body: z.object({
            prompt: z.string().min(1).describe("Prompt to send to Nova")
        }),
        response: {
            200: commonSuccessResponses[200].extend({
                message: z.string().default("Nova response received"),
                data: z.string().describe("Nova model response")
            }),
            400: commonErrorResponses[400],
            401: commonErrorResponses[401],
            500: commonErrorResponses[500]
        },
        security: [{ bearerAuth: [] }]
    },
};
