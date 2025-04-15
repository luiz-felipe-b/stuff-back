import { FastifyInstance } from "fastify";
import { authRoutes } from "./lib/modules/auth/auth.routes.ts";
import { userRoutes } from "./lib/modules/users/users.routes.ts";

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
}
