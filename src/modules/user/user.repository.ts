import { db } from '../../shared/db/drizzle';
import { eq } from 'drizzle-orm';
import { userTable } from './user.model';
import { IUserRepository } from './interfaces/user.repository.interface';
import { User } from './user.schema';

export class UserRepository implements IUserRepository {
    async createUser(data: { publicId: string, firstName: string, lastName: string }): Promise<User> {
        const [user] = await db.insert(userTable).values(data).returning();
        return user;
    }

    async getAllUsers() {
        return db.select().from(userTable);
    }

    async getUserByPublicId(publicId: string) {
        return db.select().from(userTable).where(eq(userTable.publicId, publicId));
    }

    async updateUserByPublicId(publicId: string, data: { firstName: string, lastName: string }) {
        return db.update(userTable).set(data).where(eq(userTable.publicId, publicId)).returning();
    }

    async deleteUserByPublicId(publicId: string) {
        return db.delete(userTable).where(eq(userTable.publicId, publicId)).returning();
    }
}
