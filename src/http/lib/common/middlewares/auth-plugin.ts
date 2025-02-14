import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../../modules/auth/services/auth-service";
import { RefreshTokenRepository } from "../../modules/auth/repositories/refresh-token-repository";
import { UserRepository } from "../../modules/users/repositories/users-repository";
import app from "../../../app";

export default fp(async (fastify: FastifyInstance) => {
    const refreshTokenRepository = new RefreshTokenRepository();
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository, refreshTokenRepository);
    // Middleware para verificar o token
    fastify.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const refreshToken =  await authService.findToken(req);
            if (!refreshToken) {
                return reply.status(401).send({ message: "Unauthorized" });
            }
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                return reply.status(401).send({ message: "Unauthorized" });
            }
        } catch (err) {
            reply.status(401).send({ message: "Unauthorized" });
        }
    });
});
