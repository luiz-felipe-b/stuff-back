import { UserRepositoryInterface } from "./users-repository.interface";
import { User } from "../models/user-model";
import { db } from "../../../../../db/connection";
import { users } from "../schemas/users-schema";
import { eq } from "drizzle-orm";

export class UserRepository implements UserRepositoryInterface {
    async findById(id: string): Promise<User | null> {
        const [result] = await db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return result;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [result] = await db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return result;
    }

    async findAll(): Promise<User[]> {
        const result = await db.select().from(users);
        return result;
    }

    async create(data: Omit<User, 'createdAt' | 'updatedAt' | 'active' | 'authenticated'>): Promise<User> {
        const [result] = await db.insert(users).values(data).returning() as User[];
        return result;
    }

    async update(data: Partial<User>): Promise<User> {
        const [result] = await db.update(users).set(data).where(eq(users.id, data.id)).returning() as User[];
        return result;
    }

    async delete(id: string): Promise<User> {
        const [result] = await db.delete(users).where(eq(users.id, id)).returning() as User[];
        return result;
    }
}
