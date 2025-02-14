import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../models/user-model";
import { UserService } from "../services/users-service";
import { Controller } from "../../../common/controllers/controller.js";

export class UserController extends Controller {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    async getUserById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<Partial<User>> {
        return await this.handleRequest(req, reply, async () => {
            const user = await this.userService.getUserById(req);
            return reply.code(200).send(user);
        });
    }

    async getUserByEmail(req: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const user = await this.userService.getUserByEmail(req);
            return reply.code(200).send(user);
        });
    }

    async getAllUsers(req: FastifyRequest, reply: FastifyReply): Promise<Partial<User>[]> {
        return this.handleRequest(req, reply, async () => {
            const users = await this.userService.getAllUsers();
            return reply.code(200).send({ users });
        });
    }

    async createUser(req: FastifyRequest< { Body: Pick<User, 'firstName' | 'lastName' | 'email' | 'password'>} >, reply: FastifyReply): Promise<Partial<User>> {
        return this.handleRequest(req, reply, async () => {
            const user = await this.userService.createUser(req);
            return reply.code(201).send(user);
        });
    }

    async updateUser(req: FastifyRequest, reply: FastifyReply): Promise<User> {
        return this.handleRequest(req, reply, async () => {
            const user = await this.userService.updateUser(req);
            return reply.code(200).send({ message: "User was updated successfully", user });
        });
    }

    async deleteUser(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<User> {
        return this.handleRequest(req, reply, async () => {
            const user = await this.userService.deleteUser(req);
            return reply.code(200).send({ message: "User was removed successfully", user });
        });
    }
}
