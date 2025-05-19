import { eq } from "drizzle-orm/pg-core/expressions";
import { db } from "../../../../db/connection";
import { organizations } from "../../../../db/schemas/organizations.schema";
import { Organization, PublicOrganization } from "./organizations.schema";

export class OrganizationRepository {
   async getAll(): Promise<PublicOrganization[]> {
      const result = await db.select().from(organizations);
      return result;
   }

   async getById(id: string): Promise<PublicOrganization | null> {
      const [result] = await db.select().from(organizations).where(eq(organizations.id, id));
      return result;
   }

   async getBySlug(slug: string): Promise<PublicOrganization | null> {
      const [result] = await db.select().from(organizations).where(eq(organizations.slug, slug));
      return result;
   }

   async create(data: Omit<Organization, 'createdAt' | 'updatedAt'>): Promise<PublicOrganization> {
      const [result] = await db.insert(organizations).values(data).returning() as PublicOrganization[];
      return result;
   }

   async update(data: Partial<PublicOrganization>): Promise<PublicOrganization> {
      const [result] = await db.update(organizations).set(data).where(eq(organizations.id, data.id)).returning() as PublicOrganization[];
      return result;
   }

}