import { FastifyRequest, FastifyReply } from "fastify";
import { AIService } from "../services/ai.service";

export class AIController {
    private readonly aiService: AIService;
    constructor(aiService: AIService) {
        this.aiService = aiService;
    }

    async invokeNova(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { prompt } = request.body as { prompt?: string };
            if (!prompt) throw new Error("Prompt is required");
            const result = await this.aiService.invokeNova(prompt);
            reply.code(200).send({
                data: result,
                message: "Claude response received"
            });
        } catch (err: any) {
            reply.code(400).send({
                message: err.message || "Error invoking Claude",
                data: null
            });
        }
    }
}
