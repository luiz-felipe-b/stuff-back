import { UserRepository } from "../users/repositories/users.repository.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { z } from "zod";
import { PasswordResetTokenRepository } from "./repositories/password-reset-token.repository.js";
import { EmailService } from "../../util/email/email.service.js";
import { authRouteDocs } from "./docs/auth.doc.js";

export async function authRoutes(app: FastifyTypedInstance) {
    const refreshTokenRepository = new RefreshTokenRepository();
    const userRepository = new UserRepository();
    const passwordResetTokenRepository = new PasswordResetTokenRepository();
    const emailService = new EmailService();
    const authService = new AuthService(userRepository, refreshTokenRepository, passwordResetTokenRepository, emailService);
    const authController = new AuthController(authService);

    app.post('/login', {
        schema: authRouteDocs.login
    }, authController.login.bind(authController));

    app.post('/logout', {
        schema: authRouteDocs.logout
    }, authController.logout.bind(authController));

    app.post('/refresh-token', {
        schema: authRouteDocs.refreshToken
    }, authController.refreshToken.bind(authController));

    app.post('/forgot-password', {
        schema: authRouteDocs.forgotPassword
    }, authController.forgotPassword.bind(authController));

    app.post('/reset-password', {
        schema: authRouteDocs.resetPassword
    }, authController.resetPassword.bind(authController));
}
