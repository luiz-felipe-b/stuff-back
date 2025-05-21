import { error } from "console";
import { FastifyReply, FastifyRequest } from "fastify";

export function authorizePermission(allowedRoles: string[]): (request: FastifyRequest, reply: FastifyReply, done: () => void) => FastifyReply | void {
    return function (request: FastifyRequest, reply: FastifyReply, done: () => void) {
        const userRole = request.user.role;
        const hasPermission = userRole && allowedRoles.includes(userRole);
        if (!hasPermission) {
            return reply.code(403).send({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
        }
        done();
    };
}