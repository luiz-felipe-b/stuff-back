import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        verifyToken: (token: string) => { valid: false; error: any } | { valid: true; id: string};
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}