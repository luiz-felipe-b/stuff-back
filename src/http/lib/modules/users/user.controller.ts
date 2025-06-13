import { FastifyReply, FastifyRequest } from "fastify";
import { PublicUser, refreshTokenSchema, updateUserSchema, User, userIdentifierParamSchema } from "./user.schema.ts";
import { UserService } from "./users.service.ts";
import { Controller } from "../../common/controllers/controller";
import { z } from "zod";
import app from "../../../app.ts";
import { BadRequestError } from "../../util/errors/bad-request.error.ts";
import { UnauthorizedError } from "../../util/errors/unauthorized.error.ts";
import { NotFoundError } from "../../util/errors/not-found.error.ts";

export class UserController extends Controller {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    async getUserByIdentifier(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return await this.handleRequest(req, reply, async () => {
            const identififierValidation = z.object({
                identifier: z.string({message: 'Identifier needs to be a string'}).min(1, { message: 'Identifier is required' })
            });
            const validatedIdentifier = identififierValidation.safeParse(req.params);

            if (!validatedIdentifier.success) throw new BadRequestError(validatedIdentifier.error.errors[0].message);

            const { identifier } = validatedIdentifier.data;

            const user = await this.userService.getUserByIdentifier(identifier);
            return reply.code(200).send({ data: user, message: 'User found' });
        });
    }

    // async getUserByEmail(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    //     return this.handleRequest(req, reply, async () => {
    //         const paramsSchema = z.object({
    //             email: z.string().email(),
    //         })
    
    //         const params = paramsSchema.safeParse(req.params);
    //         if (params.success === false) {
    //             throw new HttpError('Invalid email', 400);
    //         }
    //         const { email } = params.data;

    //         const user = await this.userService.getUserByEmail(email);

    //         return reply.code(200).send({ data: user, message: 'User found' });
    //     });
    // }

    async getMe(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const user = await this.userService.getUserByIdentifier(req.user.id);
            return reply.code(200).send({ data: user, message: 'User found' });
        });
    }

    async getAllUsers(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const users = await this.userService.getAllUsers();
            return reply.code(200).send({ data: users, message: 'Users found' });
        });
    }

    async createUser(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const requestBodySchema = z.object({
                firstName: z.string().min(2).max(50),
                lastName: z.string().min(2).max(50),
                userName: z.string().min(2).max(50),
                email: z.string().email(),
                password: z.string().min(8),
                role: z.enum(['admin', 'moderator', 'user']).optional().default('user'),
                tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional().default('free'),
            });

            const validated = requestBodySchema.safeParse(req.body);
            if (!validated.success) {
                const errorFields = validated.error.errors.map(err => err.path.join('.'));
                const missingFields = errorFields.join(', ');
                throw new BadRequestError(`Missing or invalid parameters: ${missingFields}`);
            }

            const user = await this.userService.createUser(validated.data);
            return reply.code(201).send({ data: user, message: 'User created' });
        });
    }

    async updateUser(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const params = userIdentifierParamSchema.safeParse(req.params);
            if (!params.success) throw new BadRequestError('Missing user ID');

            const body = updateUserSchema.safeParse(req.body);
            if (!body.success) throw new BadRequestError('Missing or invalid parameters');

            await this.userService.updateUser(params.data.identifier, body.data);
            return reply.code(200).send({ message: 'User updated' });
        });
    }

    async updateMe(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            // Validando o token
            const validated = refreshTokenSchema.safeParse(req.cookies);
            if (!validated.success) throw new UnauthorizedError('Authentication token missing');
            // Decodificando o token
            const decodedToken = app.jwt.decode(validated.data.refreshToken) as { id: string };
            if (decodedToken === null || !decodedToken.id) throw new UnauthorizedError('Invalid refresh token');
            // Validando o corpo da requisição
            const body = updateUserSchema.safeParse(req.body);
            if (!body.success) throw new BadRequestError('Missing or invalid parameters');

            await this.userService.updateUser(decodedToken.id, body.data);
            return reply.code(200).send({ message: 'User updated' });
        });
    }

    async updateMePassword(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            // Validando o token
            const validated = refreshTokenSchema.safeParse(req.cookies);
            if (!validated.success) throw new UnauthorizedError('Authentication token missing');
            const { refreshToken } = validated.data;
            // Decodificando o token
            const decodedToken = app.jwt.verify(refreshToken) as { id: string };
            if (decodedToken === null || !decodedToken.id) throw new UnauthorizedError('Invalid refresh token');
            const userId = decodedToken.id;
            // Validando o corpo da requisição
            const requestBodySchema = z.object({
                newPassword: z.string(),
                currentPassword: z.string(),
            })
            const validatedBody = requestBodySchema.safeParse(req.body);
            if (!validatedBody.success) throw new BadRequestError('Missing or invalid parameters');
            
            const passwordData = {
                newPassword: validatedBody.data.newPassword,
                currentPassword: validatedBody.data.currentPassword
            };
            
            // Atualizando a senha
            const user = await this.userService.updatePasswordMe(userId, passwordData);
            if (!user) throw new NotFoundError('User not found');

            return reply.code(200).send({ message: 'Password updated' });
        });
    }

    async deleteUser(req: FastifyRequest, reply: FastifyReply): Promise<User> {
        return this.handleRequest(req, reply, async () => {
            const params = userIdentifierParamSchema.safeParse(req.params);
            console.log(params, req.params)
            if (!params.success) {
                throw new BadRequestError('Missing user ID');
            }
            const { identifier } = params.data;

            const user = await this.userService.deleteUser(identifier);
            return reply.code(200).send({ data: user, message: 'User deleted' });
        });
    }
}
 