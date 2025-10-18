import { UserRepository } from "../users/repositories/users.repository.js";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../util/hash-password.js";
import app from "../../../app.js";
import { RefreshTokenRepository } from "./repositories/refresh-token-repository.js";
import { FastifyRequest } from "fastify";
import { PasswordResetTokenRepository } from "./repositories/password-reset-token.repository.ts";
import { EmailService } from "../../util/email/email.service.ts";
import { generateAccessToken } from "../../util/tokens/generate-access-token.ts";
import { generateRefreshToken } from "../../util/tokens/generate-refresh-token.ts";
import { db } from "../../../../db/connection.ts";
import { BadRequestError } from "../../util/errors/bad-request.error.ts";
import { NotFoundError } from "../../util/errors/not-found.error.ts";
import { UnauthorizedError } from "../../util/errors/unauthorized.error.ts";
import { env } from "../../../../env.ts";

export class AuthService {
    constructor(
        private userRepository: UserRepository, 
        private refreshTokenRepository: RefreshTokenRepository, 
        private passwordResetTokenRepository: PasswordResetTokenRepository, 
        private emailService: EmailService
    ) {}

    async login(req: FastifyRequest): Promise<{ accessToken: string; refreshToken: string }> {
        const requestSchema = z.object({
            email: z.string().email(),
            password: z.string(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) throw new BadRequestError('Missing or invalid parameters');

        const { email, password } = validation.data;

        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) throw new NotFoundError('User not found');

        // Verificar se a senha está correta
        if (!(await verifyPassword(password, user.password))) throw new UnauthorizedError('Invalid credentials');

        // Gerar tokens
        const accessToken = generateAccessToken(app, { id: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken(app, { id: user.id });
        // Definir data de validade
        const tokenGenerationDate = new Date();
        const tokenExpirationDate = new Date(tokenGenerationDate);
        tokenExpirationDate.setDate(tokenExpirationDate.getDate() + 7);
        db.transaction(async (tx) => {
            const refreshTokenRepository = new RefreshTokenRepository(tx);
            const userRepository = new UserRepository(tx);

            // Salvar refresh token no banco de dados
            await refreshTokenRepository.saveRefreshToken(refreshToken, user.id, tokenExpirationDate);

            // Alterar o usuário para logado
            await userRepository.update({ id: user.id, authenticated: true });
            }
        );

        return { accessToken, refreshToken };
    }

    async logout(req: FastifyRequest): Promise<void> {
        const requestSchema = z.object({
            refreshToken: z.string(),
        });

        const validation = requestSchema.safeParse(req.cookies);
        if (!validation.success) throw new BadRequestError('Missing or invalid parameters');

        const { refreshToken } = validation.data;

        // Verificar se o token existe
        const token = await this.refreshTokenRepository.findRefreshToken(refreshToken);
        if (!token || token.revoked) throw new UnauthorizedError('Invalid token');

        await this.refreshTokenRepository.revokeRefreshToken(refreshToken);
        await this.userRepository.update({ id: token.userId, authenticated: false });
    }

    async refreshToken(req: FastifyRequest): Promise<{ accessToken: string }> {
        const requestSchema = z.object({
            refreshToken: z.string(),
        });
        const validation = requestSchema.safeParse(req.cookies);
        if (!validation.success) throw new BadRequestError('Missing or invalid parameters');

        const jwtSchema = z.object({
            id: z.string(),
        });
        const { refreshToken } = validation.data;
        const refreshTokenValidation = jwtSchema.safeParse(app.jwt.verify(refreshToken));
        if (!refreshTokenValidation.success) throw new UnauthorizedError('Invalid token');

        const { refresh_tokens: token, users: user } = await this.refreshTokenRepository.findRefreshTokenWithUser(refreshToken);
        // // Verificar se o token existe
        // const token = await this.refreshTokenRepository.findRefreshToken(refreshToken);
        // if (!token || token.revoked) {
        //     throw new HttpError('Invalid token', 401);
        // }

        // // Verificar se o token expirou
        if (token.expiresAt < new Date()) throw new UnauthorizedError('Token expired');

        // // Verificar se o usuário existe
        // const user = await this.userRepository.findById(id);
        // if (!user) {
        //     throw new HttpError('User not found', 404);
        // }

        // Gerar novo token
        const accessToken = generateAccessToken(app, { id: user.id, email: user.email, role: user.role });

        return { accessToken };
    }

    async forgotPassword(req: FastifyRequest): Promise<void> {
        const requestSchema = z.object({
            email: z.string().email(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) throw new BadRequestError('Email is required');
        const { email } = validation.data;
        // Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) return;
        // Gerar token de redefinição de senha
        const resetToken = app.jwt.sign({ id: user.id }, { expiresIn: '1h' });

        await this.emailService.sendEmail({
            subject: '🔒 Password Reset Request',
            htmlContent: `<p>Here's your password reset link: <a href="${env.FRONTEND_URL}/reset-password?token=${resetToken}">CLICK ME</a></p>`,
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
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) throw new BadRequestError('Missing or invalid parameters');
        const { token, newPassword } = validation.data;

        const jwtSchema = z.object({
            id: z.string(),
        });

        const decodedTokenValidation = jwtSchema.safeParse(app.jwt.verify(token));
        if (!decodedTokenValidation.success) throw new UnauthorizedError('Invalid token');
        // const checkToken = await this.passwordResetTokenRepository.findPasswordResetToken(token);
        // if (!checkToken || checkToken.revoked || checkToken.expiresAt < new Date()) {
        //     throw new HttpError('Invalid token', 401);
        // }
        // const { id } = decodedTokenValidation.data;

        // // Verificar se o usuário existe
        // const user = await this.userRepository.findById(id);
        // if (!user) {
        //     throw new HttpError('User not found', 404);
        // }

        const { userId, revoked, expiresAt } = await this.passwordResetTokenRepository.findPasswordResetTokenWithUser(token);

        if (!userId) throw new NotFoundError('User does not exist');

        const now = new Date();
        if (revoked || expiresAt < now) throw new UnauthorizedError('Invalid token');

        // Criar hash da nova senha
        const password = await hashPassword(newPassword);

        await db.transaction(async (tx) => {
            const passwordResetTokenRepository = new PasswordResetTokenRepository(tx);
            const userRepository = new UserRepository(tx);
            
            // Revogar o token
            await passwordResetTokenRepository.revokePasswordResetToken(token);
            // Atualizar senha
            await userRepository.update({ id: userId, password });
        });

        // // Revogar o token
        // await this.passwordResetTokenRepository.revokePasswordResetToken(token);

        // // Atualizar senha
        // await this.userRepository.update({ id: userId, password });
    }

}
