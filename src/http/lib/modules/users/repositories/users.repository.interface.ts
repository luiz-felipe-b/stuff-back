import { User } from "../models/user-model";

export interface UserRepositoryInterface {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(data: any): Promise<User>;
    update(data: any): Promise<User>;
    delete(id: string): Promise<User>;
}
