import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

declare module 'fastify' {
    interface FastifyInstance {
        verifyToken: (token: string) => { valid: false; error: any } | { valid: true; id: string};
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        nanoid: () => string;
    }
}

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>
