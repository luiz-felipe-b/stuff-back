import { UserRepository } from "../users/repositories/users-repository.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { AuthService } from "./services/auth-service.js";
import { AuthController } from "./controllers/auth-controller.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { z } from "zod";

export async function authRoutes(app: FastifyTypedInstance) {
    const refreshTokenRepository = new RefreshTokenRepository();
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    const authController = new AuthController(authService);

    app.post('/login', {
        schema: {
            description: 'Login with an account',
            tags: ['auth'],
            body: z.object({
                email: z.string().email(),
                password: z.string(),
            }),
            response: {
                200: z.object({accessToken: z.string()}),
            }
        }
    }, authController.login.bind(authController));

    app.post('/logout', {
        schema: {
            description: 'Logout from an account',
            tags: ['auth'],
            body: z.object({
                refreshToken: z.string(),
            }),
            response: {
                200: z.object({success: z.boolean()}),
            }
        }
    }, authController.logout.bind(authController));
}
