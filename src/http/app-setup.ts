import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { env } from "../env";

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
                { name: 'user', description: 'User related end-points' },
                { name: 'auth', description: 'Authentication related end-points' }
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
    })

    app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.send(err)
        }
    });
}
