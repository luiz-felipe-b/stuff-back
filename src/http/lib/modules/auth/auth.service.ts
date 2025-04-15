import { UserRepository } from "../users/repositories/users.repository.js";
import { z } from "zod";
import { verifyPassword } from "../../util/hash-password.js";
import app from "../../../app.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { HttpError } from "../../util/errors/http-error.js";
import { FastifyRequest } from "fastify";
import { env } from "../../../../env.ts";
import { PasswordResetTokenRepository } from "./repositories/password-reset-token.repository.ts";
import { EmailService } from "../../util/email/email.service.ts";

export class AuthService {
    constructor(private userRepository: UserRepository, private refreshTokenRepository: RefreshTokenRepository, private passwordResetTokenRepository: PasswordResetTokenRepository, private emailService: EmailService) {

    }

    async login(req: FastifyRequest): Promise<{ accessToken: string; refreshToken: string }> {
        const requestSchema = z.object({
            email: z.string().email(),
            password: z.string(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const { email, password } = validation.data;

        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpError('User not found', 404);
        }

        // Verificar se a senha está correta
        if (!(await verifyPassword(password, user.password))) {
            throw new HttpError('Invalid credentials', 401);
        }

        // Gerar tokens
        const accessToken = app.jwt.sign({ id: user.id }, { expiresIn: '15m' });
        const refreshToken = app.jwt.sign({ id: user.id }, { expiresIn: '7d' });
        // Definir data de validade
        const tokenGenerationDate = new Date();
        const tokenExpirationDate = new Date(tokenGenerationDate);
        tokenExpirationDate.setDate(tokenExpirationDate.getDate() + 7);
        // Salvar refresh token no banco de dados
        await this.refreshTokenRepository.saveRefreshToken(refreshToken, user.id, tokenExpirationDate);

        return { accessToken, refreshToken };
    }

    async logout(req: FastifyRequest): Promise<void> {
        const requestSchema = z.object({
            refreshToken: z.string(),
        });

        const validation = requestSchema.safeParse(req.cookies);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const { refreshToken } = validation.data;

        // Verificar se o token existe
        const token = await this.refreshTokenRepository.findRefreshToken(refreshToken);
        if (!token || token.revoked) {
            throw new HttpError('Invalid token', 401);
        }

        await this.refreshTokenRepository.revokeRefreshToken(refreshToken);
    }

    async refreshToken(req: FastifyRequest): Promise<{ accessToken: string }> {
        const requestSchema = z.object({
            refreshToken: z.string(),
        });
        const validation = requestSchema.safeParse(req.cookies);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const { refreshToken } = validation.data;

        // Verificar se o token existe
        const token = await this.refreshTokenRepository.findRefreshToken(refreshToken);
        if (!token || token.revoked) {
            throw new HttpError('Invalid token', 401);
        }

        // Verificar se o token expirou
        if (token.expiresAt < new Date()) {
            throw new HttpError('Token expired', 401);
        }

        // Gerar novo token
        const accessToken = app.jwt.sign({ id: token.userId }, { expiresIn: '15m' });

        return { accessToken };
    }

    async forgotPassword(req: FastifyRequest): Promise<void> {
        const requestSchema = z.object({
            email: z.string().email(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) {
            throw new HttpError('Password reset link sent to your email.', 200);
        }
        const { email } = validation.data;
        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpError('Password reset link sent to your email.', 200);
        }
        // Gerar token de redefinição de senha
        const resetToken = app.jwt.sign({ id: user.id }, { expiresIn: '1h' });
        
        await this.emailService.sendEmail();

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // Add 1 hour
        // await this.passwordResetTokenRepository.savePasswordResetToken(user.id, resetToken, expirationDate);

        return;
    }

    async resetPassword(req: FastifyRequest): Promise<void> {
        const requestSchema = z.object({
            email: z.string().email(),
            password: z.string(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const { email, password } = validation.data;

        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpError('User not found', 404);
        }

        // Atualizar senha
        await this.userRepository.update({ id: user.id, password });
    }

}
