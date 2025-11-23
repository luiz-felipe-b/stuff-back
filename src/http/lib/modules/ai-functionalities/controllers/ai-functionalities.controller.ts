import { FastifyRequest, FastifyReply } from "fastify";
import { AIFunctionalitiesService } from "../services/ai-functionalities.service";

export class AIFunctionalitiesController {
    private readonly service: AIFunctionalitiesService;
    constructor(service: AIFunctionalitiesService) {
        this.service = service;
    }

    async describeImage(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { key, contextPrompt } = request.body as { key: string, contextPrompt?: string };
            if (!key) throw new Error("key é obrigatório");
            const result = await this.service.describeImage(key, contextPrompt);
            // Return only the raw JSON (no formatting, no message wrapper)
            reply.code(200).send(result);
        } catch (err: any) {
            reply.code(400).send({
                message: err.message || "Error describing image from bucket",
                data: null
            });
        }
    }
    /**
     * Gera uma presigned URL para upload de imagem em images/ai no Supabase S3
     * Body esperado: { filename: string }
     */
    async getPresignedImageUrl(request: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this.service.generatePresignedImageUrl();
            return reply.send(result);
        } catch (err: any) {
            return reply.code(400).send({ error: err.message || "Erro ao gerar presigned URL" });
        }
    }
}
