import { FastifyInstance } from "fastify";
import { AccessTokenPayload } from "../../../../types/http/tokens";
import { env } from "../../../../env";

export function generateAccessToken(app: FastifyInstance, data: AccessTokenPayload) {
    return app.jwt.sign(data, {
        expiresIn: env.NODE_ENV === 'production' ? '15m' : '7d',
    });
}