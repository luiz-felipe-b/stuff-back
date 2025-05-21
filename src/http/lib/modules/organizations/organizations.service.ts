import { z } from 'zod';
import { OrganizationRepository } from './organizations.repository';
import { HttpError } from '../../util/errors/http-error';
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from '../../util/hash-password';

export class OrganizationService {
    private organizationRepository: OrganizationRepository;

    constructor(organizationRepository: OrganizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    async getAllOrganizations() {
        return this.organizationRepository.getAll();
    }

    async getOrganizationByIdentifier(identifier: string) {
        const uuidValidator = z.string().uuid();
        const isUUID = uuidValidator.safeParse(identifier).success;
        if (isUUID) {
            const idResult = await this.organizationRepository.getById(identifier);
            if (!idResult) {
                throw new HttpError('Organization not found', 404);
            }
            return idResult;
        }
        const slugResult = await this.organizationRepository.getBySlug(identifier);
        if (!slugResult) {
            throw new HttpError('Organization not found', 404);
        }
        return slugResult;
    }

    async createOrganization(data: { name: string; slug: string; description?: string; password?: string; ownerId: string }) {
        const { name, slug, description, password, ownerId } = data;
        if (z.string().uuid().safeParse(slug).success) throw new HttpError('Slug cannot be a UUID', 400);
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const organization = await this.organizationRepository.create({
            id: uuidv4(),
            name,
            slug,
            description,
            password: hashedPassword,
            ownerId,
            active: true
        });
        return organization;
    }
}