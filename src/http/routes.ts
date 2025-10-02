import { FastifyInstance } from "fastify";
import { authRoutes } from "./lib/modules/auth/auth.routes.ts";
import { userRoutes } from "./lib/modules/users/users.routes.ts";
import { organizationsRoutes } from "./lib/modules/organizations/organizations.routes.ts";
import { assetsRoutes } from "./lib/modules/assets/routes/assets.routes.ts";
import { attributesRoutes } from "./lib/modules/assets/routes/attributes.routes.ts";
import { aiRoutes } from "./lib/modules/ai/routes/ai.routes.ts";
import { aiFunctionalitiesRoutes } from "./lib/modules/ai-functionalities/routes/ai-functionalities.routes.ts";

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(organizationsRoutes, { prefix: '/organizations' });
  app.register(assetsRoutes, { prefix: '/assets' });
  app.register(attributesRoutes, { prefix: '/attributes' });
  app.register(aiRoutes, { prefix: '/ai' });
  app.register(aiFunctionalitiesRoutes, { prefix: '/ai-functionalities' });
}
