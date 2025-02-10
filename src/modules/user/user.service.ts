import { IUserRepository } from "./interfaces/user.repository.interface";
import { AccessService } from "../access/services/access.service";
import { nanoid } from "nanoid";

export class UserService {
    private userRepository: IUserRepository;
    private accessService: AccessService;

    constructor(userRepository: IUserRepository, accessService: AccessService) {
        this.userRepository = userRepository;
        this.accessService = accessService;
    }

    async createUser(data: { firstName: string, lastName: string, email: string, password: string }) {
        const publicId = nanoid();
        const { email, password } = data;
        const user = await this.userRepository.createUser({ publicId, ...data });
        const access = await this.accessService.createAccess({ email, password, userId: user.id });
        return { user, access };
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserByPublicId(publicId: string) {
        return this.userRepository.getUserByPublicId(publicId);
    }

    async updateUserByPublicId(publicId: string, data: { firstName: string, lastName: string }) {
        return this.userRepository.updateUserByPublicId(publicId, data);
    }

    async deleteUserByPublicId(publicId: string) {
        return this.userRepository.deleteUserByPublicId(publicId);
    }
}
