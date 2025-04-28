import { db } from "../../../../db/connection";
import { organizations } from "../../../../db/schemas/organizations.schema";
import { PublicOrganization } from "./organizations.schema";

export class OrganizationRepository {
     async getAll(): Promise<PublicOrganization[]> {
        const result = await db.select().from(organizations);
        return result;
     }

}