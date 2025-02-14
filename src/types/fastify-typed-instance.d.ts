import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, FastifyRequest, FastifyReply } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export interface FastifyTypedInstance extends FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
> {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
