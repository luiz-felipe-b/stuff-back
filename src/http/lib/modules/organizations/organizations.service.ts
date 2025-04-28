import { OrganizationRepository } from './organizations.repository';

export class OrganizationService {
    private organizationRepository: OrganizationRepository;

    constructor(organizationRepository: OrganizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    async getAllOrganizations() {
        return this.organizationRepository.getAll();
    }
}