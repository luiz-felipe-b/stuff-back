import { fastifyCookie } from "@fastify/cookie";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";

export async function appSetup(app: FastifyInstance) {
    app.register(fastifyJwt, {
        secret: 'supersecret',
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
        },
        transform: jsonSchemaTransform
    })

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    })

    app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.send(err)
        }
    });
}
