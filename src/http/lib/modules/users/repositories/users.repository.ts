import { PublicUser, User } from "../user.schema.ts";
import { db } from "../../../../../db/connection";
import { users } from "../../../../../db/schemas/users.schema.ts";
import { eq } from "drizzle-orm";
import { Database, Transaction } from "../../../../../types/db/database";

export class UserRepository {
    constructor(private db: Database | Transaction) {}

    private removeSensitiveInfo(user: User): Omit<User, 'password'> {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async findById(id: string): Promise<PublicUser | null> {
        if (!id) return null;
        const [result] = await this.db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findByEmail(email: string): Promise<PublicUser | null> {
        if (!email) return null;
        const [result] = await this.db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return this.removeSensitiveInfo(result);
    }

    async findAll(): Promise<PublicUser[]> {
        const result = await this.db.select().from(users);
        return result.map(user => this.removeSensitiveInfo(user));
    }

    async findByIdWithPassword(id: string): Promise<User | null> {
        const [result] = await this.db.select().from(users).where(eq(users.id, id));
        if (!result) return null;
        return result;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        const [result] = await this.db.select().from(users).where(eq(users.email, email));
        if (!result) return null;
        return result;
    }

    async create(data: Omit<User, 'createdAt' | 'updatedAt' | 'active' | 'authenticated'>): Promise<PublicUser> {
        const [result] = await this.db.insert(users).values(data).returning() as PublicUser[];
        return result;
    }

    async update(data: Partial<User>): Promise<Omit<User, 'password'> | null> {
        if (!data.id) return null;
        const [result] = await this.db.update(users).set(data).where(eq(users.id, data.id)).returning() as User[];
        return this.removeSensitiveInfo(result);
    }

    async delete(id: string): Promise<User> {
        const [result] = await this.db.delete(users).where(eq(users.id, id)).returning() as User[];
        return result;
    }
}
