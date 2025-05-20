import { FastifyInstance } from "fastify";
import { RefreshTokenPayload } from "../../../../types/http/tokens";

export function generateRefreshToken(app: FastifyInstance, data: RefreshTokenPayload) {
    return app.jwt.sign(data, {
        expiresIn: '7d',
    });
}