import { and, eq } from "drizzle-orm/pg-core/expressions";
import { db } from "../../../../db/connection";
import { organizations } from "../../../../db/schemas/organizations.schema";
import { Organization, PublicOrganization } from "./organizations.schema";
import { Database, Transaction } from "../../../../types/db/database";
import { PublicUser } from "../users/user.schema";
import { users, userTiers } from "../../../../db/schemas/users.schema";
import { usersOrganizations } from "../../../../db/schemas/users-organizations.schema";
import { assetInstances } from "../../../../db/schemas/assets/assets-instances.schema";
import { AssetInstance } from "../assets/schemas/assets-instances.schema";

export class OrganizationRepository {
   constructor(private readonly db: Database | Transaction) { }

   async getAll(): Promise<PublicOrganization[]> {
      const result = await this.db.select().from(organizations);
      return result;
   }

   async getById(id: string): Promise<PublicOrganization | null> {
      const [result] = await this.db
         .select()
         .from(organizations)
         .where(eq(organizations.id, id));
      return result;
   }

   async getBySlug(slug: string): Promise<PublicOrganization | null> {
      const [result] = await this.db
         .select()
         .from(organizations)
         .where(eq(organizations.slug, slug));
      return result;
   }

   async create(
      data: Omit<Organization, "createdAt" | "updatedAt">
   ): Promise<PublicOrganization> {
      const [result] = (await this.db
         .insert(organizations)
         .values(data)
         .returning()) as PublicOrganization[];
      return result;
   }

   async update(data: Partial<PublicOrganization>): Promise<PublicOrganization> {
      const [result] = (await this.db
         .update(organizations)
         .set(data)
         .where(eq(organizations.id, data.id))
         .returning()) as PublicOrganization[];
      return result;
   }

   async delete(id: string): Promise<PublicOrganization | null> {
      const [result] = (await this.db
         .delete(organizations)
         .where(eq(organizations.id, id))
         .returning()) as PublicOrganization[];
      return result;
   }

   async getMembersByOrganizationId(organizationId: string): Promise<
      {
         id: string;
         firstName: string;
         lastName: string;
         userName: string;
         email: string;
         role: "admin" | "moderator" | "user";
         tier: "free" | "plus" | "pro" | "enterprise";
         active: boolean;
      }[]
   > {
      const result = await this.db
         .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            userName: users.userName,
            email: users.email,
            role: users.role,
            tier: users.tier,
            active: users.active,
            updatedAt: users.updatedAt,
            createdAt: users.createdAt,
         })
         .from(users)
         .leftJoin(usersOrganizations, eq(users.id, usersOrganizations.userId))
         .where(eq(usersOrganizations.organizationId, organizationId));
      return result;
   }

   async addMember(
      organizationId: string,
      userId: string,
      role: string
   ): Promise<{
      userId: string;
      organizationId: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
   }> {
      const [result] = await this.db
         .insert(usersOrganizations)
         .values({ userId, organizationId, role })
         .returning({
            userId: usersOrganizations.userId,
            organizationId: usersOrganizations.organizationId,
            role: usersOrganizations.role,
            createdAt: usersOrganizations.createdAt,
            updatedAt: usersOrganizations.updatedAt,
         });
      return result;
   }

   async updateMember(
      organizationId: string,
      userId: string,
      role: string
   ): Promise<{
      userId: string;
      organizationId: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
   }[] | null> {
      const result = await this.db
         .update(usersOrganizations)
         .set({ role, updatedAt: new Date() })
         .where(
            and(
               eq(usersOrganizations.organizationId, organizationId),
               eq(usersOrganizations.userId, userId)
            )
         )
         .returning({
            userId: usersOrganizations.userId,
            organizationId: usersOrganizations.organizationId,
            role: usersOrganizations.role,
            createdAt: usersOrganizations.createdAt,
            updatedAt: usersOrganizations.updatedAt,
         });
      return result;
   }

   async deleteMember(
      organizationId: string,
      userId: string
   ): Promise<{
      userId: string;
      organizationId: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
   }[] | null> {
      const result = await this.db
         .delete(usersOrganizations)
         .where(
            and(
               eq(usersOrganizations.organizationId, organizationId),
               eq(usersOrganizations.userId, userId)
            )
         )
         .returning({
            userId: usersOrganizations.userId,
            organizationId: usersOrganizations.organizationId,
            role: usersOrganizations.role,
            createdAt: usersOrganizations.createdAt,
            updatedAt: usersOrganizations.updatedAt,
         });
      return result;
   }

   async getAssetsByOrganizationId(organizationId: string): Promise<AssetInstance[]> {
      const result = await this.db
         .select()
         .from(assetInstances)
         .where(eq(assetInstances.organizationId, organizationId));
      return result;
   }
}
