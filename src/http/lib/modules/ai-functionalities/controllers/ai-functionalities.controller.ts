import { FastifyRequest, FastifyReply } from "fastify";
import { AIFunctionalitiesService } from "../services/ai-functionalities.service";

export class AIFunctionalitiesController {
    private readonly service: AIFunctionalitiesService;
    constructor(service: AIFunctionalitiesService) {
        this.service = service;
    }

    async describeImage(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { imageBase64, assetMetadata, prompt } = request.body as { imageBase64?: string, assetMetadata?: any, prompt?: string };
            if (!imageBase64) throw new Error("imageBase64 is required");
            // Get description from AI
            const description = await this.service.describeImage(imageBase64, prompt);
            // Stub: Register asset (replace with actual DB logic)
            const asset = {
                ...assetMetadata,
                description,
                registeredAt: new Date().toISOString()
            };
            reply.code(201).send({
                data: asset,
                message: "Asset registered from image description"
            });
        } catch (err: any) {
            reply.code(400).send({
                message: err.message || "Error registering asset from image",
                data: null
            });
        }
    }
}
