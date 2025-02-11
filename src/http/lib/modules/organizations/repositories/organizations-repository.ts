import { db } from "../../../../../db/connection";
import { Organization } from "../models/organization-model";
import { organizations } from "../schemas/organizations-schema";
import { OrganizationsRepositoryInterface } from "./organizations-repository.interface";
import { eq } from "drizzle-orm";

export class OrganizationsRepository implements OrganizationsRepositoryInterface {
    async findById(id: string): Promise<Organization | null> {
        const [result] = await db.select().from(organizations).where(eq(organizations.id, id));
        if (!result) return null;
        return result;
    }
    async findByCode(code: string): Promise<Organization | null> {
        const [result] = await db.select().from(organizations).where(eq(organizations.organizationCode, code));
        if (!result) return null;
        return result;
    }
    async findAll(): Promise<Organization[]> {
        const result = await db.select().from(organizations);
        return result;
    }
    async create(data: any): Promise<Organization> {
        const [result] = await db.insert(organizations).values(data).returning() as Organization[];
        return result;
    }
    async update(data: any): Promise<Organization> {
        const [result] = await db.update(organizations).set(data).where(eq(organizations.id, data.id)).returning() as Organization[];
        return result;
    }
    async delete(id: string): Promise<Organization> {
        const [result] = await db.delete(organizations).where(eq(organizations.id, id)).returning() as Organization[];
        return result;
    }
}
