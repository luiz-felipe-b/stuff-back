import { FastifyInstance } from "fastify";
import { AccessTokenPayload } from "../../../../types/http/tokens";

export function generateAccessToken(app: FastifyInstance, data: AccessTokenPayload) {
    return app.jwt.sign(data, {
        expiresIn: '15m',
    });
}