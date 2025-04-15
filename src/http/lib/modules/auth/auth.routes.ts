import { UserRepository } from "../users/repositories/users.repository.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { z } from "zod";
import { PasswordResetTokenRepository } from "./repositories/password-reset-token.repository.js";
import { EmailService } from "../../util/email/email.service.js";

export async function authRoutes(app: FastifyTypedInstance) {
    const refreshTokenRepository = new RefreshTokenRepository();
    const userRepository = new UserRepository();
    const passwordResetTokenRepository = new PasswordResetTokenRepository();
    const emailService = new EmailService();
    const authService = new AuthService(userRepository, refreshTokenRepository, passwordResetTokenRepository, emailService);
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

    app.post('/refresh-token', {
        schema: {
            description: 'Refresh the access token',
            tags: ['auth'],
            body: z.object({
                refreshToken: z.string(),
            }),
            response: {
                200: z.object({accessToken: z.string()}),
            }
        }
    }, authController.refreshToken.bind(authController));


    app.post('/forgot-password', {
        schema: {
            description: 'Request a password reset',
            tags: ['auth'],
            body: z.object({
                email: z.string().email(),
            }),
            response: {
                200: z.object({message: z.string(), success: z.boolean()}),
            }
        }
    }, authController.forgotPassword.bind(authController));


    app.post('/reset-password/forgot', {
        schema: {
            description: 'Reset password using a reset password token',
            security: [{bearerAuth: []}],
            tags: ['auth'],
            body: z.object({
                newPassword: z.string(),
            }),
            response: {
                200: z.object({message: z.string(), success: z.boolean()}),
            }
        }
    }, authController.resetPasswordOnForget.bind(authController));
}
