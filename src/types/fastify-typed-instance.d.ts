import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

declare module 'fastify' {
    interface FastifyInstance {
        verifyToken: (token: string) => { valid: false; error: any } | { valid: true; id: string, role: "admin" | "moderator" | "user" };
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        nanoid: () => string;
    }

    interface FastifyRequest {
        user: {
            id: string;
            role: 'admin' | 'moderator' | 'user';
        };
    }
}

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>
