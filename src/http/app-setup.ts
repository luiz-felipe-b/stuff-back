import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { env } from "../env";
import { swaggerAuth } from "./lib/util/swagger/swagger-auth";
import { z } from "zod";

const tokenPayloadSchema = z.object({
    id: z.string(),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

export async function appSetup(app: FastifyInstance) {
    app.register(fastifyJwt, {
        secret: env.JWT_SECRET,
        cookie: {
            cookieName: 'refreshToken',
            signed: false
        }
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(fastifyCookie);

    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Stuff API',
                description: 'API documentation',
                version: '0.1.0'
            },
            tags: [
                { name: 'auth', description: 'Authentication related end-points' },
                { name: 'user', description: 'User related end-points' },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                }
            },
        },
        transform: jsonSchemaTransform,

    })

    app.register(fastifySwaggerUi, {
        routePrefix: env.SWAGGER_URL,
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
        uiHooks: {
            preHandler: swaggerAuth,
        }
    })

    app.decorate('verifyToken', (token: string) => {
        try {
            const decoded = app.jwt.verify(token, { key: env.JWT_SECRET });
            const result = tokenPayloadSchema.safeParse(decoded);
            if (!result.success) {
                return { valid: false, error: { code: 'INVALID_TOKEN_PAYLOAD', details: result.error } }
            }
            return { valid: true, id: result.data.id }
        } catch (error) {
            return { valid: false, error }
        }
    });

    app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        const authHeaderSchema = z.string().regex(/^Bearer\s.+$/);

        const authHeader = req.headers.authorization
        const authHeaderResult = authHeaderSchema.safeParse(authHeader);

        if (!authHeaderResult.success) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header',
                statusCode: 401,
            });
        }

        const accessToken = authHeaderResult.data.split(' ')[1];

        const accessResult = app.verifyToken(accessToken);

        if (accessResult.valid !== false) {
            req.user = accessResult;
            return;
        }

        const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Missing refresh token',
                statusCode: accessResult.error.code,
            });
        }

        const refreshTokenValue = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken;
        const refreshResult = app.verifyToken(refreshTokenValue);
        console.log(refreshResult)
        if (refreshResult.valid === false) {
            return reply.code(401).send({ error: 'Invalid refresh token' })
        }

        const newAccessToken = app.jwt.sign({ id: refreshResult.id }, { key: env.JWT_SECRET, expiresIn: '15m' });

        reply.header('X-New-Access-Token', newAccessToken)
        req.user = { id: refreshResult.id }
    });
}