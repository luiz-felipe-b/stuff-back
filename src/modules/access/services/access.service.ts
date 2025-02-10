import { nanoid } from "nanoid";
import { IAccessRepository } from "../interfaces/access.repository.interface";
import { PasswordService } from "./password.service";

export class AccessService {
    private accessRepository: IAccessRepository;
    private passwordService: PasswordService;

    constructor(accessRepository: IAccessRepository) {
        this.accessRepository = accessRepository;
        this.passwordService = new PasswordService();
    }

    async createAccess(data: { email: string, password: string, userId: number }) {
        const publicId = nanoid();
        const { password, ...rest } = data;
        const hashedPassword = await this.passwordService.hashPassword(password);
        return this.accessRepository.createAccess({ publicId, password: hashedPassword, ...rest });
    }
}
