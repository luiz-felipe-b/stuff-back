import { User } from "../user.schema";

export interface IUserRepository {
    createUser(data: { publicId: string, firstName: string, lastName: string }): Promise<User>;

    getAllUsers(): Promise<any>;

    getUserByPublicId(publicId: string): Promise<any>;

    updateUserByPublicId(publicId: string, data: { firstName: string, lastName: string }): Promise<any>;

    deleteUserByPublicId(publicId: string): Promise<any>;
}
