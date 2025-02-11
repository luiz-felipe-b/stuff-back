import { UserRepository } from "../../users/repositories/users-repository.js";
import { z } from "zod";
import { verifyPassword } from "../../../util/hash-password.js";
import app from "../../../../app.js";
import { RefreshTokenRepository } from "../repositories/refresh-token-repository.js";
import { HttpError } from "../../../util/errors/http-error.js";
import { FastifyRequest } from "fastify";

export class AuthService {
    constructor(private userRepository: UserRepository, private refreshTokenRepository: RefreshTokenRepository) {}

    async login(req: FastifyRequest): Promise<{ accessToken: string; refreshToken: string }> {
        // Validar os dados de entrada
        const requestSchema = z.object({
            email: z.string().email(),
            password: z.string(),
        });
        const validation = requestSchema.safeParse(req.body);
        if (!validation.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const { email, password } = validation.data;

        console.log(email, password)

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
        console.log(req.cookies)
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

        await this.refreshTokenRepository.expireRefreshToken(refreshToken);
    }


}
