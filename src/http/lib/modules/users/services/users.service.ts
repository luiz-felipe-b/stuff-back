import { nanoid } from "nanoid";
import { User } from "../user.schema.ts";
import { UserRepository } from "../repositories/users.repository.js";
import { z } from "zod";
import { hashPassword } from "../../../util/hash-password.js";
import { HttpError } from "../../../util/errors/http-error.js";
import { FastifyRequest } from "fastify";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    /**
     * Obtém um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async getUserById(req: FastifyRequest): Promise<User | null> {
        const requestSchema = z.object({
            id: z.string(),
        });

        const validated = requestSchema.safeParse(req.params);
        if (!validated.success) {
            throw new Error('Missing or invalid id');
        }

        return this.userRepository.findById(validated.data.id);
    }

    /**
     * Obtém um usuário pelo email
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async getUserByEmail(req: FastifyRequest): Promise<User | null> {
        const requestSchema = z.object({
            email: z.string().email(),
        })

        const validated = requestSchema.safeParse(req.body);
        if (!validated.success) {
            throw new Error('Missing or invalid email');
        }

        return this.userRepository.findByEmail(validated.data.email);
    }

    /**
     * Obtém todos os usuários
     * @returns Promise<User[]>
     */
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    /**
     * Cria um novo usuário
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async createUser(req: FastifyRequest): Promise<User> {
        const requestSchema = z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            password: z.string(),
            tier: z.enum(["free", "plus", "pro", "enterprise"]),
        });
        const validated = requestSchema.safeParse(req.body);
        if (!validated.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }

        const userExists = await this.userRepository.findByEmail(validated.data.email);
        if (userExists) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(validated.data.password);

        const newUser: Omit<User, 'createdAt' | 'updatedAt' | 'active' | 'authenticated'> = {
            id: nanoid(),
            firstName: validated.data.firstName,
            lastName: validated.data.lastName,
            email: validated.data.email,
            password: hashedPassword,
            organizationId: null,
            role: "admin",
            tier: "free"
        }

        return this.userRepository.create(newUser);
    }

    /**
     * Atualiza um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async updateUser(req: FastifyRequest): Promise<User> {
        // Define o schema dos parametros da requisição
        const paramSchema = z.object({
            id: z.string(),
        });
        // Valida os parametros da requisição
        const validatedParams = paramSchema.safeParse(req.params);
        if (!validatedParams.success) {
            throw new HttpError('Missing or invalid id', 400);
        }

        // Define o schema dos parametros do corpo da requisição
        const bodySchema = z.object({
            organizationId: z.string().nullable().optional(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().optional(),
            active: z.boolean().optional(),
            type: z.enum(["admin", "staff", "root", "invited"]).optional(),
        });
        // Valida os parametros da requisição
        const validatedBody = bodySchema.safeParse(req.body);
        if (!validatedBody.success) {
            throw new HttpError('Missing or invalid parameters', 400);
        }
        // Se todos os parametros estiverem indefinidos, lança um erro
        if (Object.values(validatedBody.data).every(value => value === undefined)) {
            throw new HttpError('No parameters to update', 400);
        }

        const updatedData = {
            id: validatedParams.data.id,
            ...Object.entries(validatedBody.data).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Partial<User>),
        }

        return this.userRepository.update(updatedData);
    }

    /**
     * Deleta um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async deleteUser(req: FastifyRequest): Promise<User> {
        const requestSchema = z.object({
            id: z.string(),
        });

        const validated = requestSchema.safeParse(req.params);
        if (!validated.success) {
            throw new Error('Missing or invalid id');
        }

        return this.userRepository.delete(validated.data.id);
    }
}
