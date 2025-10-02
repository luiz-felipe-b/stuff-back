import { AIController } from "../controllers/ai.controller";
import { AIService } from "../services/ai.service";
import { FastifyTypedInstance } from "../../../../../types/fastify-typed-instance";
import { aiRoutesDocs } from "../docs/ai.docs";

export async function aiRoutes(app: FastifyTypedInstance) {
    const aiService = new AIService();
    const aiController = new AIController(aiService);

    app.post("/invoke", {
        onRequest: [app.authenticate],
        schema: aiRoutesDocs.invokeNova
    }, aiController.invokeNova.bind(aiController));
}
