import { UserRepository } from "./repositories/users-repository.js";
import { UserController } from "./controllers/user-controller.js";
import { UserService } from "./services/users-service.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { z } from "zod";

export async function userRoutes(app: FastifyTypedInstance) {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.get('/', {
        onRequest: [app.authenticate],
        schema: {
            description: 'Get all users',
            tags: ['users'],
            response: {
                200: z.object({
                    users: z.array(z.object({
                        id: z.string(),
                        organizationId: z.string().nullable(),
                        firstName: z.string(),
                        lastName: z.string(),
                        email: z.string().email(),
                        type: z.enum(['admin', 'staff', 'root' ,'invited']).default('invited'),
                        active: z.boolean(),
                        authenticated: z.boolean(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                    }))
                })
            },
        },
    }, userController.getAllUsers.bind(userController));

    app.get('/:id',
        {
            onRequest: [app.authenticate],
            schema: {
                description: 'Get a user by id',
                tags: ['users'],
                params: z.object({
                    id: z.string(),
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        organizationId: z.string().nullable(),
                        firstName: z.string(),
                        lastName: z.string(),
                        email: z.string().email(),
                        type: z.enum(['admin', 'staff', 'root' ,'invited']).default('invited'),
                        active: z.boolean(),
                        authenticated: z.boolean(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                    })
                }
            }
        }, userController.getUserById.bind(userController));

    app.post('/',
        {
            onRequest: [app.authenticate],
            schema: {
                description: 'Creates a new user',
                tags: ['users'],
                body: z.object({
                    organizationId: z.string().nullable().default(null),
                    firstName: z.string(),
                    lastName: z.string(),
                    email: z.string().email(),
                    password: z.string(),
                    type: z.enum(['admin', 'staff', 'root' ,'invited']).default('invited'),
                }),
                response: {
                    201: z.object({
                        id: z.string(),
                        organizationId: z.string().nullable(),
                        firstName: z.string(),
                        lastName: z.string(),
                        email: z.string().email(),
                        type: z.enum(['admin', 'staff', 'root' ,'invited']),
                        active: z.boolean(),
                        authenticated: z.boolean(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                    })
                }
            }
        }
        ,userController.createUser.bind(userController));

    app.put('/:id',
        {
            onRequest: [app.authenticate],
            schema: {
                description: 'Updates a user',
                tags: ['users'],
                params: z.object({
                    id: z.string(),
                }),
                body: z.object({
                    organizationId: z.string().optional(),
                    firstName: z.string().optional(),
                    lastName: z.string().optional(),
                    email: z.string().email().optional(),
                    password: z.string().optional(),
                    type: z.enum(['admin', 'staff', 'root' ,'invited']).optional(),
                    active: z.boolean().optional(),
                    authenticated: z.boolean().optional(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                        user: z.object({
                            id: z.string(),
                            email: z.string().email(),
                        })
                    })
                }
            }
        }, userController.updateUser.bind(userController));

    app.delete('/:id',
        {
            schema: {
                description: 'Deletes a user',
                tags: ['users'],
                params: z.object({
                    id: z.string(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                        user: z.object({
                            id: z.string(),
                            email: z.string().email(),
                        })
                    })
                }
        }
    }, userController.deleteUser.bind(userController));
}
