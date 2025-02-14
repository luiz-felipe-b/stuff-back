import { authRoutes } from "./lib/modules/auth/auth-routes.js";
import { userRoutes } from "./lib/modules/users/user-routes.js";
import { organizationsRoutes } from "./lib/modules/organizations/organizations-routes.js";
import { FastifyTypedInstance } from "../types/fastify-typed-instance.js";
import { insertTokenCookies } from "./lib/modules/debug/insert-token-cookies.js";
import { env } from "../env.js";

export async function registerRoutes(app: FastifyTypedInstance) {
    if (env.NODE_ENV === 'development') {
        app.register(insertTokenCookies, { prefix: '/debug' });
    }
    app.register(authRoutes, { prefix: '/auth' });
    app.register(userRoutes, { prefix: '/users' });
    app.register(organizationsRoutes, { prefix: '/organizations' });
}
