import { CreateUserSchema, PublicUser, UpdateUserSchema, User } from "./user.schema";
import { UserRepository } from "./repositories/users.repository";
import { z } from "zod";
import { hashPassword } from "../../util/hash-password";
import { HttpError } from "../../util/errors/http-error";
import { FastifyRequest } from "fastify";
import app from "../../../app";
import { v4 as uuidv4 } from "uuid";

/**
 * Serviço de Usuário
 * @description Este serviço é responsável por gerenciar as operações relacionadas aos usuários.
 * @class UserService
 * @param userRepository - Repositório de Usuário
 */
export class UserService {
    constructor(private userRepository: UserRepository) {}

    /**
     * Obtém um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async getUserById(id: string): Promise<PublicUser | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new HttpError('User not found', 404);
        }
        return user;
    }

    /**
     * Obtém um usuário pelo email
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async getUserByEmail(email: string): Promise<PublicUser | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new HttpError('User not found', 404);
        }
        return user;
    }
    

    /**
     * Obtém todos os usuários
     * @returns Promise<User[]>
     */
    async getAllUsers(): Promise<PublicUser[]> {
        return this.userRepository.findAll();
    }

    /**
     * Cria um novo usuário
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async createUser(user: CreateUserSchema): Promise<PublicUser> {

        const hashedPassword = await hashPassword(user.password);

        const newUser = {
            id: uuidv4(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            tier: user.tier,
        }

        const result = this.userRepository.create(newUser);
        console.log(result);
        return result;
    }

    /**
     * Atualiza um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async updateUser(id: string, data: UpdateUserSchema): Promise<void> {
        if (Object.values(data).every(value => value === undefined)) {
            throw new HttpError('No parameters to update', 400);
        }

        const updatedData = {
            id,
            ...Object.entries(data).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Partial<User>),
        }

        const user = this.userRepository.update(updatedData);
        if (!user) {
            throw new HttpError('User not found', 404);
        }
    }

    /**
     * Obtém o usuário autenticado
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    // async updateMe(id: string, user: UpdateUserSchema): Promise<PublicUser | null> {
    //     const cookiesSchema = z.object({
    //         refreshToken: z.string(),
    //     });
    //     const validated = cookiesSchema.safeParse(req.cookies);
    //     if (!validated.success) {
    //         throw new Error('Missing or invalid refresh token');
    //     }

    //     const decodedToken = app.jwt.verify(validated.data.refreshToken) as { userId: string };
    //     if (decodedToken === null) {
    //         throw new Error('Invalid refresh token');
    //     }
    //     const userId = decodedToken.userId;

    //     const user = await this.userRepository.findById(userId);
    //     if (user === null) {
    //         throw new Error('User not found');
    //     }

    //     const requestBodySchema = z.object({
    //         firstName: z.string().optional(),
    //         lastName: z.string().optional(),
    //         email: z.string().email().optional(),
    //         updatedAt: z.date().optional().default(new Date()),
    //     })
    //     const validatedBody = requestBodySchema.safeParse(req.body);
    //     if (!validatedBody.success) {
    //         throw new Error('Missing or invalid parameters');
    //     }

    //     const updatedData = {
    //         id: user.id,
    //         ...Object.entries(validatedBody.data).reduce((acc, [key, value]) => {
    //             if (value !== undefined) {
    //                 acc[key] = value;
    //             }
    //             return acc;
    //         }, {} as Partial<User>),
    //     }
    //     // Se todos os parametros estiverem indefinidos, lança um erro
    //     if (Object.values(validatedBody.data).every(value => value === undefined)) {
    //         throw new Error('No parameters to update');
    //     }
    //     // Atualiza o usuário
    //     const updatedUser = await this.userRepository.update(updatedData);
    //     if (updatedUser === null) {
    //         throw new Error('User not found');
    //     }

    //     return updatedUser;
    // }

    /**
     * Obtém o usuário autenticado
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async updatePasswordMe(id: string, passwordData: {newPassword: string, currentPassword:string}): Promise<PublicUser | null> {
        // Se todos os parametros estiverem indefinidos, lança um erro
        if (passwordData.newPassword === undefined || passwordData.currentPassword === undefined || passwordData.newPassword === '') {
            throw new Error('No parameters to update');
        }

        // TODO: Verificar se a senha antiga está correta
        // // Verifica se a senha antiga está correta
        // if (user.password !== validatedBody.data.oldPassword) {
        //     throw new Error('Old password is incorrect');
        // }
        
        // Atualiza a senha do usuário
        const updatedUser = await this.userRepository.update({
            id,
            password: await hashPassword(passwordData.newPassword),
        });

        return updatedUser;
    }

    /**
     * Deleta um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.delete(id);
        if (!user) {
            throw new HttpError('User not found', 404);
        }
    }
}
