import { FastifyBaseLogger, FastifyInstance, FastifyReply, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { RequestUser } from "./http/requests";

declare module 'fastify' {
    interface FastifyInstance {
        verifyToken: (token: string) => { valid: false; error: any } | { valid: true; id: string, email: string, role: "admin" | "moderator" | "user" };
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        nanoid: () => string;
    }

    interface FastifyRequest {
        user: RequestUser;
    }
}

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>
