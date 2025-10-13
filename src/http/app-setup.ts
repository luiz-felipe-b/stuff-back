import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { env } from "../env";
import { features } from "../features";
import { swaggerAuth } from "./lib/util/swagger/swagger-auth";
import { z } from "zod";
import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart';
import { requestUserSchema } from "../types/http/requests";

export async function appSetup(app: FastifyInstance) {
    app.register(fastifyMultipart, { attachFieldsToBody: true });
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

    app.register(cors, {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    })

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
                { name: 'organizations', description: 'Organization related end-points' },
                { name: 'assets', description: 'Assets related end-points' },
                { name: 'attributes', description: 'Attributes related end-points' },
                { name: 'ai', description: 'AI related end-points' },
                { name: 'ai-functionalities', description: 'AI Functionalities related end-points' },
                { name: 'reports', description: 'Reports related end-points' },
                { name: 'to-do', description: 'End-points that still have work to be done' },
                { name: 'swagger', description: 'Swagger related end-points' },
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
            const result = requestUserSchema.safeParse(decoded);
            if (!result.success) {
                return { valid: false, error: { code: 'INVALID_TOKEN_PAYLOAD', details: result.error } }
            }
            return { valid: true, id: result.data.id, email: result.data.email, role: result.data.role }
        } catch (error) {
            return { valid: false, error }
        }
    });

    app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        if (!features.requireAuth) {
            // Use the same admin user as seeded in the database
            req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'admin@example.com', role: 'admin' };
            return;
        }
        const authHeaderSchema = z.string().regex(/^Bearer\s.+$/);
        const authHeader = req.headers.authorization;
        const authHeaderResult = authHeaderSchema.safeParse(authHeader);
        if (authHeaderResult.success) {
            const accessToken = authHeaderResult.data.split(' ')[1];
            const accessResult = app.verifyToken(accessToken);
            if (accessResult.valid !== false) {
                req.user = { id: accessResult.id, email: accessResult.email, role: accessResult.role };
                return;
            }
        }
        return reply.code(401).send({
            error: 'UnauthorizedError',
            message: 'Authentication token is missing or not valid',
        });
    });
}