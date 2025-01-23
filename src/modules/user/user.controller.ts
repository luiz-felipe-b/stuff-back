import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from './index';

export const UserController = {
    async createUser(req: FastifyRequest, reply: FastifyReply) {
        const { firstName, lastName } = req.body as { firstName: string, lastName: string };
        try {
            await userService.createUser({ firstName, lastName });
            reply.status(201).send({ message: 'User created successfully' });
        } catch (error) {
            reply.status(500).send({ message: 'Failed to create user' });
        }
    },

    async getAllUsers(reply: FastifyReply) {
        try {
            const users = await userService.getAllUsers();
            reply.send(users);
        } catch (error) {
            reply.status(500).send({ message: 'Failed to fetch users' });
        }
    },

    async getUserByPublicId(req: FastifyRequest, reply: FastifyReply) {
        const { publicId } = req.params as any;

        try {
            const user = await userService.getUserByPublicId(publicId);
            reply.send(user);
        } catch (error) {
            reply.status(500).send({ message: 'Failed to fetch user' });
        }
    },
}
