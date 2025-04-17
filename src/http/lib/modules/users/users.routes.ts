import { UserRepository } from "./repositories/users.repository.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./users.service.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { userRouteDocs } from "./docs/user.doc.js";

export async function userRoutes(app: FastifyTypedInstance) {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.get('/', {
        schema: userRouteDocs.getAllUsers
    }, userController.getAllUsers.bind(userController));

    app.get('/me', {
        schema: userRouteDocs.getUserByEmail
    }, userController.getUserByEmail.bind(userController));

    app.get('/:id', {
        schema: userRouteDocs.getUserById
    }, userController.getUserById.bind(userController));

    app.post('/', {
        schema: userRouteDocs.createUser
    }, userController.createUser.bind(userController));

    app.patch('/:id', {
        schema: userRouteDocs.updateUser
    }, userController.updateUser.bind(userController));

    app.patch('/me', {
        schema: userRouteDocs.updateMe
    }, userController.updateMe.bind(userController));

    app.post('/me/password', {
        schema: userRouteDocs.updateMePassword
    }, userController.updateMePassword.bind(userController));

    app.delete('/:id', {
        schema: userRouteDocs.deleteUser
    }, userController.deleteUser.bind(userController));
}
