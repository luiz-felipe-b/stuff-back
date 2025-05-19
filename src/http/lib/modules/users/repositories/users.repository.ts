import { UserRepositoryInterface } from "./users.repository.interface";
import { PublicUser, User } from "../user.schema.ts";
import { db } from "../../../../../db/connection";
import { users } from "../../../../../db/schemas/users.schema.ts";
import { eq } from "drizzle-orm";
import { HttpError } from "../../../util/errors/http-error.ts";

export class UserRepository implements UserRepositoryInterface {
    private removeSensitiveInfo(user: User): Omit<User, 'password'> {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async findById(id: string): Promise<PublicUser | null> {
        if (!id) return null;
        const [result] = await db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findByEmail(email: string): Promise<PublicUser | null> {
        if (!email) return null;
        const [result] = await db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findAll(): Promise<PublicUser[]> {
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

    async create(data: Omit<User, 'createdAt' | 'updatedAt' | 'active' | 'authenticated'>): Promise<PublicUser> {
        const [result] = await db.insert(users).values(data).returning() as PublicUser[];
        return result;
        try {
        } catch (error) {
            if (error.code === '23505' && error.constraint === 'users_email_unique') {
                throw new HttpError('User already exists', 409);
            }
            throw new Error('Error creating user');
        }
    }

    async update(data: Partial<User>): Promise<Omit<User, 'password'>> {
        const [result] = await db.update(users).set(data).where(eq(users.id, data.id)).returning() as User[];
        return this.removeSensitiveInfo(result);
    }

    async delete(id: string): Promise<User> {
        const [result] = await db.delete(users).where(eq(users.id, id)).returning() as User[];
        return result;
    }
}
