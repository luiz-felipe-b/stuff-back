import { FastifyInstance } from "fastify";
import { authRoutes } from "./lib/modules/auth/auth.routes.ts";
import { userRoutes } from "./lib/modules/users/users.routes.ts";
import { organizationsRoutes } from "./lib/modules/organizations/organizations.routes.ts";
import { assetsRoutes } from "./lib/modules/assets/routes/assets.routes.ts";
import { attributesRoutes } from "./lib/modules/assets/routes/attributes.routes.ts";
import { aiRoutes } from "./lib/modules/ai/routes/ai.routes.ts";
import { aiFunctionalitiesRoutes } from "./lib/modules/ai-functionalities/routes/ai-functionalities.routes.ts";
import { reportsRoutes } from './lib/modules/reports/routes/reports.routes.ts';

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(organizationsRoutes, { prefix: '/organizations' });
  app.register(assetsRoutes, { prefix: '/assets' });
  app.register(attributesRoutes, { prefix: '/attributes' });
  app.register(aiRoutes, { prefix: '/ai' });
  app.register(aiFunctionalitiesRoutes, { prefix: '/ai-functionalities' });
  app.register(reportsRoutes, { prefix: '/reports' });
  app.register(async (app) => {
    app.get('/test-s3', async (request, reply) => {
      // Exemplo: listar arquivos do bucket "public" (ajuste conforme seu bucket)
      try {
        const { listSupabaseS3Objects } = await import('./lib/util/s3-connection');
        const bucket = 'stuff-app'; // troque para o nome do seu bucket
        const files = await listSupabaseS3Objects(bucket);
        return { files };
      } catch (err) {
        reply.status(500);
        return { error: (err as Error).message };
      }
    });
  });
}
