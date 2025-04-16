import { UserRepository } from "./repositories/users.repository.js";
import { UserController } from "./controllers/user-controller.js";
import { UserService } from "./services/users.service.js";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance.js";

export async function userRoutes(app: FastifyTypedInstance) {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    app.get('/',userController.getAllUsers.bind(userController));
    app.get('/:id',userController.getUserById.bind(userController));
    app.post('/',userController.createUser.bind(userController));
    app.patch('/:id',userController.updateUser.bind(userController));
    app.delete('/:id',userController.deleteUser.bind(userController));
}
