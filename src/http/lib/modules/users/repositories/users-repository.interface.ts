import { User } from "../models/user-model";

export interface UserRepositoryInterface {
    findById(id: string): Promise<Partial<User> | null>;
    findByEmail(email: string): Promise<Partial<User> | null>;
    findAll(): Promise<Partial<User>[]>;
    create(data: any): Promise<Partial<User>>;
    update(data: any): Promise<Partial<User>>;
    delete(id: string): Promise<Partial<User>>;
}
