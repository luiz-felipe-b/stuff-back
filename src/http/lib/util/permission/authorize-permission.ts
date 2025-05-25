import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export function authorizeUserAccess(allowedRoles?: string[]): (request: FastifyRequest, reply: FastifyReply, done: () => void) => FastifyReply | void {
    return function (request: FastifyRequest, reply: FastifyReply, done: () => void) {

        if (!allowedRoles) {
            reply.code(403).send({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
            return done();
        }
        
        const userRole = request.user.role;
        const rolePermission = (userRole && allowedRoles.includes(userRole));

        if (rolePermission) {
            return done();
        }

        // Pega o ID do usuário autenticado
        const userId = request.user.id;
        const paramsValidator = z.object({
            identifier: z.string().uuid({ message: 'Invalid user ID' }),
        });
        const paramsId = paramsValidator.safeParse(request.params).data?.identifier;
        const selfPermission = userId === paramsId

        if (selfPermission) {
            return done();
        }
        
        reply.code(403).send({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
        return done();
    };
}