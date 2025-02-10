import { db } from '../../shared/db/drizzle';
import { accessTable } from './access.model';
import { IAccessRepository } from './interfaces/access.repository.interface';

export class AccessRepository implements IAccessRepository {
    async createAccess(data: { email: string, password: string, publicId: string, userId: number }) {
        return db.insert(accessTable).values(data).returning();
    }
}
