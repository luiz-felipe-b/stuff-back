import { UserRepositoryInterface } from "./users-repository.interface";
import { User } from "../models/user-model";
import { db } from "../../../../../db/connection";
import { users } from "../schemas/users-schema";
import { eq } from "drizzle-orm";

export class UserRepository implements UserRepositoryInterface {
    async findById(id: string): Promise<Partial<User> | null> {
        const [result] = await db.select(
            {
                id: users.id,
                organizationId: users.organizationId,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                active: users.active,
                authenticated: users.authenticated,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            }
        ).from(users).where(eq(users.id, id));
        if (!result) return null;
        return result;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [result] = await db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return result;
    }

    async findAll(): Promise<Partial<User>[]> {
        const result = await db.select(
            {
                id: users.id,
                organizationId: users.organizationId,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                active: users.active,
                authenticated: users.authenticated,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            }
        ).from(users);
        return result;
    }

    async create(data: Omit<User, 'createdAt' | 'updatedAt' | 'active' | 'authenticated'>): Promise<Partial<User>> {
        const [result] = await db.insert(users).values(data).returning({
            id: users.id,
            organizationId: users.organizationId,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            type: users.type,
            active: users.active,
            authenticated: users.authenticated,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        }) as Partial<User>[];
        return result;
    }

    async update(data: Partial<User>): Promise<User> {
        const [result] = await db.update(users).set(data).where(eq(users.id, data.id)).returning({ id: users.id, email: users.email }) as User[];
        return result;
    }

    async delete(id: string): Promise<User> {
        const [result] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id, email: users.email }) as User[];
        return result;
    }
}
