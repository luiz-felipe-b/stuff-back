import { UserRepositoryInterface } from "./users.repository.interface";
import { User } from "../user.schema.ts";
import { db } from "../../../../../db/connection";
import { users } from "../../../../../db/schemas/users.schema.ts";
import { eq } from "drizzle-orm";

export class UserRepository implements UserRepositoryInterface {
    private removeSensitiveInfo(user: User): Omit<User, 'password'> {
        // Remove sensitive fields from user object
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const [result] = await db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
        const [result] = await db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const result = await db.select().from(users);
        return result.map(user => this.removeSensitiveInfo(user));
    }

    async findByIdWithPassword(id: string): Promise<User | null> {
        const [result] = await db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return result;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const [result] = await db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
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
