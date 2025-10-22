
import { UserRepository } from "./repositories/users.repository.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./users.service.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";
import { userRouteDocs } from "./docs/user.doc.js";
import { authorizeUserAccess } from "../../util/permission/authorize-permission.js";
import { db } from "../../../../db/connection.js";

export async function userRoutes(app: FastifyTypedInstance) {
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.get('/', {
        onRequest: [app.authenticate],
        // preHandler: [authorizeUserAccess(['admin', 'moderator', 'user'])],
        schema: userRouteDocs.getAllUsers
    }, userController.getAllUsers.bind(userController));

    app.get('/:id', {
        onRequest: [app.authenticate],
        // preHandler: [authorizeUserAccess(['admin', 'moderator'])],
        schema: userRouteDocs.getUserById
    }, userController.getUserById.bind(userController));

    app.get('/by-email', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.getUserByEmail
    }, userController.getUserByEmail.bind(userController));

    app.get('/me', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.getMe
    }, userController.getMe.bind(userController));

    app.post('/', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.createUser,
        // preHandler: [authorizeUserAccess(['admin', 'moderator'])],
        attachValidation: true
    }, userController.createUser.bind(userController));

    app.patch('/:id', {
        onRequest: [app.authenticate],
        // preHandler: [authorizeUserAccess(['admin', 'moderator'])],
        schema: userRouteDocs.updateUser
    }, userController.updateUser.bind(userController));

    app.patch('/me', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.updateMe
    }, userController.updateMe.bind(userController));

    app.post('/me/password', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.updateMePassword
    }, userController.updateMePassword.bind(userController));

    app.delete('/:id', {
        onRequest: [app.authenticate],
        schema: userRouteDocs.deleteUser
    }, userController.deleteUser.bind(userController));
}
