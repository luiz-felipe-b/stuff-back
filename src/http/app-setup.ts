import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { FastifyTypedInstance } from "../types/fastify-typed-instance";
import { RefreshTokenRepository } from "./lib/modules/auth/repositories/refresh-token-repository";
import { AuthService } from "./lib/modules/auth/services/auth-service";
import { UserRepository } from "./lib/modules/users/repositories/users-repository";
import { registerRoutes } from "./routes";

export async function appSetup(app: FastifyTypedInstance) {
    app.register(fastifyJwt, {
        secret: 'supersecret',
        cookie: {
            cookieName: 'refreshToken',
            signed: false
        }
    });

    app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
        const refreshTokenRepository = new RefreshTokenRepository();
        const userRepository = new UserRepository();
        const authService = new AuthService(userRepository, refreshTokenRepository);
        try {
            const refreshToken =  await authService.findToken(req);
            if (!refreshToken) {
                return reply.status(401).send({ message: "Unauthorized" });
            }
            app.jwt.verify(refreshToken.token);

            const accessToken = req.headers.authorization;
            if (!accessToken) {
                return reply.status(401).send({ message: "Unauthorized" });
            }
            app.jwt.verify(accessToken.split(' ')[1]);
        } catch (err) {
            reply.status(401).send({ message: "Unauthorized" });
        }
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(fastifyCookie);

    app.register(fastifySwagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Stuff API',
                description: 'API documentation',
                version: '0.1.0'
            },
            components: {
                securitySchemes: {
                    refreshToken: {
                        type: 'apiKey',
                        name: 'refreshToken',
                        in: 'cookie',
                        description: 'Cookie that contains the refresh token'
                    },
                    accessToken: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Bearer token that contains the access token'
                    }
                }
            },
            security: [{ refreshToken: [], accessToken: [] }]
        },
        transform: jsonSchemaTransform
    })

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        staticCSP: true,
    })

    await registerRoutes(app);
}
