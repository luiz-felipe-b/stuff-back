import { AIFunctionalitiesController } from "../controllers/ai-functionalities.controller";
import { AIFunctionalitiesService } from "../services/ai-functionalities.service";
import { FastifyTypedInstance } from "../../../../../types/fastify-typed-instance";
import { aiFunctionalitiesRoutesDocs } from "../docs/ai-functionalities.docs";

export async function aiFunctionalitiesRoutes(app: FastifyTypedInstance) {
    const service = new AIFunctionalitiesService();
    const controller = new AIFunctionalitiesController(service);

    app.post("/describe-image", {
        onRequest: [app.authenticate],
        schema: aiFunctionalitiesRoutesDocs.describeImage
    }, controller.describeImage.bind(controller));
}
