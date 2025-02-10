import { FastifyInstance } from "fastify";
import { authRoutes } from "./lib/modules/auth/auth-routes.js";
import { userRoutes } from "./lib/modules/users/user-routes.js";

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
}
