import { OrganizationTiers } from "../definitions/enums/organization-tiers-enum.ts";

export interface Organization {
    id: string;
    authorId: string;
    organizationCode: string;
    name: string;
    tier: OrganizationTiers;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
