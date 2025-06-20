import { CreateUserSchema, PublicUser, UpdateUserSchema, User } from "./user.schema";
import { UserRepository } from "./repositories/users.repository";
import { z } from "zod";
import { hashPassword } from "../../util/hash-password";
import { FastifyRequest } from "fastify";
import app from "../../../app";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../../util/errors/not-found.error";
import { BadRequestError } from "../../util/errors/bad-request.error";

/**
 * Serviço de Usuário
 * @description Este serviço é responsável por gerenciar as operações relacionadas aos usuários.
 * @class UserService
 * @param userRepository - Repositório de Usuário
 */
export class UserService {
    constructor(private userRepository: UserRepository) {}

    /**
     * Obtém um usuário por um identificador (ID ou email)
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    async getUserByIdentifier(identifier: string): Promise<PublicUser | null> {
        const uuidValidator = z.string().uuid();
        const isUUID = uuidValidator.safeParse(identifier).success;
        if (isUUID) {
            const idResult = await this.userRepository.findById(identifier);
            if (!idResult) {
                throw new NotFoundError('User not found');
            }
            return idResult;
        }
        const emailValidator = z.string().email();
        const isEmail = emailValidator.safeParse(identifier).success;
        if (isEmail) {
            const emailResult = await this.userRepository.findByEmail(identifier);
            if (!emailResult) {
                throw new NotFoundError('User not found');
            }
            return emailResult;
        }
        throw new BadRequestError('Invalid identifier');
    }

    /**
     * Obtém um usuário pelo email
     * @param req - Requisição HTTP
     * @returns Promise<User | null>
     */
    // async getUserByEmail(email: string): Promise<PublicUser | null> {
    //     const user = await this.userRepository.findByEmail(email);
    //     if (!user) {
    //         throw new HttpError('User not found', 404);
    //     }
    //     return user;
    // }
    

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
            userName: user.userName,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            tier: user.tier,
        }

        const result = this.userRepository.create(newUser);
        return result;
    }

    /**
     * Atualiza um usuário pelo ID
     * @param req - Requisição HTTP
     * @returns Promise<User>
     */
    async updateUser(id: string, data: UpdateUserSchema): Promise<Partial<User> | null> {
        if (Object.values(data).every(value => value === undefined)) {
            return null;
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

        return user;
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
            return null;
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
        console.log(id)
        const user = await this.userRepository.delete(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
    }
}
