import { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../../util/errors/http-error";

export class Controller {
    public async handleRequest(req: FastifyRequest, reply: FastifyReply, callback: (req: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply>): Promise<FastifyReply> {
        try {
            return await callback(req, reply);
        } catch (err) {
            console.log(err)
            return this.handleHttpError(err, reply);
        }
    }

    private handleHttpError(error: Error, reply: FastifyReply): FastifyReply {
        if (error instanceof HttpError) {
            return reply.code(error.statusCode).send({ message: error.message });
        }
        return reply.code(500).send({ message: "Internal server error" });
}}
