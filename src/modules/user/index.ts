import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository();

export const userService = new UserService(userRepository);
