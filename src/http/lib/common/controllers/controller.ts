import { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../../util/errors/http-error";

export class Controller {
    public async handleRequest(req: FastifyRequest, reply: FastifyReply, callback: (req: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply>): Promise<FastifyReply> {
        try {
            return await callback(req, reply);
        } catch (err) {
            return this.handleHttpError(err, reply);
        }
    }

    private handleHttpError(error: Error, reply: FastifyReply): FastifyReply {
        console.log(error)
        if (error instanceof HttpError) {
            return reply.code(error.statusCode).send({ statusCode: error.statusCode, error: error.error, message: error.message });
        }
        return reply.code(500).send({ message: "Internal server error", error: "Internal server error", statusCode: 500});
}}
