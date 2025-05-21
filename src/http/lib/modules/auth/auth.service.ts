import { UserRepository } from "../users/repositories/users.repository.js";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../util/hash-password.js";
import app from "../../../app.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { HttpError } from "../../util/errors/http-error.js";
import { FastifyRequest } from "fastify";
import { env } from "../../../../env.ts";
import { PasswordResetTokenRepository } from "./repositories/password-reset-token.repository.ts";
import { EmailService } from "../../util/email/email.service.ts";
import { generateAccessToken } from "../../util/tokens/generate-access-token.ts";
import { generateRefreshToken } from "../../util/tokens/generate-refresh-token.ts";

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
            throw new HttpError('Missing or invalid parameters', 400, 'Bad Request');
        }

        const { email, password } = validation.data;

        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new HttpError('User not found', 404, 'Not Found');
        }

        // Verificar se a senha está correta
        if (!(await verifyPassword(password, user.password))) {
            throw new HttpError('Invalid credentials', 401, 'Unauthorized');
        }

        // Gerar tokens
        const accessToken = generateAccessToken(app, {id: user.id, role: user.role});
        const refreshToken = generateRefreshToken(app, {id: user.id});
        // Definir data de validade
        const tokenGenerationDate = new Date();
        const tokenExpirationDate = new Date(tokenGenerationDate);
        tokenExpirationDate.setDate(tokenExpirationDate.getDate() + 7);
        // Salvar refresh token no banco de dados
        await this.refreshTokenRepository.saveRefreshToken(refreshToken, user.id, tokenExpirationDate);
        // Alterar o usuário para logado
        await this.userRepository.update({ id: user.id, authenticated: true });

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
        await this.userRepository.update({ id: token.userId, authenticated: false });
    }

    async refreshToken(req: FastifyRequest): Promise<{ accessToken: string }> {
        const requestSchema = z.object({
            refreshToken: z.string(),
        });
        const validation = requestSchema.safeParse(req.cookies);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const jwtSchema = z.object({
            id: z.string(),
        });
        const { refreshToken } = validation.data;
        const refreshTokenValidation = jwtSchema.safeParse(app.jwt.verify(refreshToken));
        if (!refreshTokenValidation.success) {
            throw new HttpError('Invalid token', 401);
        }

        const { refresh_tokens: token, users: user } = await this.refreshTokenRepository.findRefreshTokenWithUser(refreshToken);
        // // Verificar se o token existe
        // const token = await this.refreshTokenRepository.findRefreshToken(refreshToken);
        // if (!token || token.revoked) {
        //     throw new HttpError('Invalid token', 401);
        // }

        // // Verificar se o token expirou
        if (token.expiresAt < new Date()) {
            throw new HttpError('Token expired', 401);
        }

        // // Verificar se o usuário existe
        // const user = await this.userRepository.findById(id);
        // if (!user) {
        //     throw new HttpError('User not found', 404);
        // }

        // Gerar novo token
        const accessToken = generateAccessToken(app, { id: user.id, role: user.role });

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
        
        await this.emailService.sendEmail({
            subject: '🔒 Password Reset Request',
            htmlContent: `<p>Here's your password reset token ${resetToken}</p>`,
            sender: { name: 'Support Team', email: 'lfbalaminute@hotmail.com' },
            to: [{ email: email }],
        });

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        await this.passwordResetTokenRepository.savePasswordResetToken(resetToken, user.id, expirationDate);

        return;
    }


    async resetPassword(req: FastifyRequest): Promise<void> {
        // Verificar se o token existe
        const requestSchema = z.object({
            token: z.string(),
            newPassword: z.string(),
        });
        const validation = requestSchema.safeParse(req.headers);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }
        const { token, newPassword } = validation.data;

        const jwtSchema = z.object({
            id: z.string(),
        });
        const decodedTokenValidation = jwtSchema.safeParse(app.jwt.verify(token));
        if (!decodedTokenValidation.success) {
            throw new HttpError('Invalid token', 401);
        }
        const checkToken = await this.passwordResetTokenRepository.findPasswordResetToken(token);
        if (!checkToken || checkToken.revoked || checkToken.expiresAt < new Date()) {
            throw new HttpError('Invalid token', 401);
        }
        const { id } = decodedTokenValidation.data;

        // Verificar se o usuário existe
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new HttpError('User not found', 404);
        }

        // Criar hash da nova senha
        const password = await hashPassword(newPassword);

        // Revogar o token
        await this.passwordResetTokenRepository.revokePasswordResetToken(token);

        // Atualizar senha
        await this.userRepository.update({ id: user.id, password });
    }

}
