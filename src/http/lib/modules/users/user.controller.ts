import { FastifyReply, FastifyRequest } from "fastify";
import { PublicUser, refreshTokenSchema, updateUserSchema, User, userIdParamSchema } from "./user.schema.ts";
import { UserService } from "./users.service.ts";
import { Controller } from "../../common/controllers/controller";
import { z } from "zod";
import { HttpError } from "../../util/errors/http-error";
import app from "../../../app.ts";

export class UserController extends Controller {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    async getUserById(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return await this.handleRequest(req, reply, async () => {
            const paramsSchema = z.object({
                id: z.string(),
            });

            const params = paramsSchema.parse(req.params);
            const { id } = params;
            if (!id) {
                throw new HttpError('User ID is required', 400);
            }

            const user = await this.userService.getUserById(id);
            return reply.code(200).send({ data: user, message: 'User found' });
        });
    }

    async getUserByEmail(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const paramsSchema = z.object({
                email: z.string().email(),
            })
    
            const params = paramsSchema.safeParse(req.params);
            if (params.success === false) {
                throw new HttpError('Invalid email', 400);
            }
            const { email } = params.data;

            const user = await this.userService.getUserByEmail(email);

            return reply.code(200).send({ data: user, message: 'User found' });
        });
    }

    async getMe(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const cookiesSchema = z.object({
                refreshToken: z.string(),
            });
            const validated = cookiesSchema.safeParse(req.cookies);
            if (!validated.success) {
                throw new HttpError('Missing or invalid refresh token', 400);
            }

            const { refreshToken } = validated.data;
            const decodedToken = app.jwt.decode(refreshToken);

            if (!decodedToken) {
                throw new HttpError('Invalid refresh token', 401);
            }
            const { id } = decodedToken as { id: string };
            if (!id) {
                throw new HttpError('User ID is required', 400);
            }
    
            const user = await this.userService.getUserById(id);
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
                email: z.string().email(),
                password: z.string().min(8),
                role: z.enum(['admin', 'moderator', 'user']).optional().default('user'),
                tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional().default('free'),
            });

            const validated = requestBodySchema.safeParse(req.body);
            if (!validated.success) {
                const errorFields = validated.error.errors.map(err => err.path.join('.'));
                const missingFields = errorFields.join(', ');
                throw new HttpError(`Missing or invalid parameters: ${missingFields}`, 400);
            }

            const user = await this.userService.createUser(validated.data);
            return reply.code(201).send({ data: user, message: 'User created' });
        });
    }

    async updateUser(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const params = userIdParamSchema.safeParse(req.params);
            if (!params.success) {
                throw new HttpError('Missing user ID', 400);
            }

            const body = updateUserSchema.safeParse(req.body);
            if (!body.success) {
                throw new HttpError('Missing or invalid parameters', 400);
            }

            await this.userService.updateUser(params.data.id, body.data);
            return reply.code(200).send({ message: 'User updated' });
        });
    }

    async updateMe(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            // Validando o token
            const validated = refreshTokenSchema.safeParse(req.cookies);
            if (!validated.success) {
                throw new HttpError('Authentication token missing', 401);
            }
            // Decodificando o token
            const decodedToken = app.jwt.decode(validated.data.refreshToken) as { id: string };
            if (decodedToken === null || !decodedToken.id) {
                throw new HttpError('Invalid refresh token', 401);
            }
            // Validando o corpo da requisição
            const body = updateUserSchema.safeParse(req.body);
            if (!body.success) {
                throw new HttpError('Missing or invalid parameters', 400);
            }

            await this.userService.updateUser(decodedToken.id, body.data);
            return reply.code(200).send({ message: 'User updated' });
        });
    }

    async updateMePassword(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            // Validando o token
            const validated = refreshTokenSchema.safeParse(req.cookies);
            if (!validated.success) {
                throw new HttpError('Authentication token missing', 401);
            }
            const { refreshToken } = validated.data;
            // Decodificando o token
            const decodedToken = app.jwt.verify(refreshToken) as { id: string };
            if (decodedToken === null || !decodedToken.id) {
                throw new HttpError('Invalid refresh token', 401);
            }
            const userId = decodedToken.id;
            // Validando o corpo da requisição
            const requestBodySchema = z.object({
                newPassword: z.string(),
                currentPassword: z.string(),
            })
            const validatedBody = requestBodySchema.safeParse(req.body);
            if (!validatedBody.success) {
                throw new HttpError('Missing or invalid parameters', 400);
            }
            
            const passwordData = {
                newPassword: validatedBody.data.newPassword,
                currentPassword: validatedBody.data.currentPassword
            };
            
            // Atualizando a senha
            const user = await this.userService.updatePasswordMe(userId, passwordData);
            if (!user) {
                throw new HttpError('User not found', 404);
            }

            return reply.code(200).send({ message: 'Password updated' });
        });
    }

    async deleteUser(req: FastifyRequest, reply: FastifyReply): Promise<User> {
        return this.handleRequest(req, reply, async () => {
            const params = userIdParamSchema.safeParse(req.params);
            if (!params.success) {
                throw new HttpError('Missing user ID', 400);
            }
            const { id } = params.data;

            const user = await this.userService.deleteUser(id);
            return reply.code(200).send({ data: user, message: 'User deleted' });
        });
    }
}
