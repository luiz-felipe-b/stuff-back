import { PublicUser } from "../user.schema";

export interface UserRepositoryInterface {
    findById(id: string): Promise<PublicUser | null>;
    findByEmail(email: string): Promise<PublicUser | null>;
    findAll(): Promise<PublicUser[]>;
    create(data: any): Promise<PublicUser>;
    update(data: any): Promise<PublicUser>;
    delete(id: string): Promise<PublicUser>;
}
