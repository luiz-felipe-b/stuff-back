import { Organization } from "../models/organization-model";

export interface OrganizationsRepositoryInterface {
    findById(id: string): Promise<Organization | null>;
    findByCode(code: string): Promise<Organization | null>;
    findAll(): Promise<Organization[]>;
    create(data: any): Promise<Organization>;
    update(data: any): Promise<Organization>;
    delete(id: string): Promise<Organization>;
}
