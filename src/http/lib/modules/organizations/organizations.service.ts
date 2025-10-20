import { EmailService } from '../../util/email/email.service';
import { z } from 'zod';
import { OrganizationRepository } from './organizations.repository';
import { HttpError } from '../../util/errors/http.error';
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from '../../util/hash-password';
import { CreateOrganization, createOrganizationSchema, UpdateOrganization } from './organizations.schema';
import { BadRequestError } from '../../util/errors/bad-request.error';
import { NotFoundError } from '../../util/errors/not-found.error';

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
            if (!idResult) throw new NotFoundError('Organization not found', 404);
            return idResult;
        }
        const slugResult = await this.organizationRepository.getBySlug(identifier);
        if (!slugResult) throw new NotFoundError('Organization not found', 404);
        return slugResult;
    }

    async createOrganization(data: CreateOrganization) {
        if (!createOrganizationSchema.safeParse(data).success) throw new BadRequestError('Slug cannot be a UUID');
        const { name, slug, description, password, ownerId } = data;
        if (z.string().uuid().safeParse(slug).success) throw new BadRequestError('Slug cannot be a UUID');
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
        if (!organization) throw new HttpError('InternalServerError', 'Failed to create organization', 500);
        const ownerRelation = await this.organizationRepository.addMember(organization.id, ownerId, 'root');
        if (!ownerRelation) throw new HttpError('InternalServerError', 'Failed to add owner to organization', 500);
        return organization;
    }
    
    async updateOrganization(id: string, data: Partial<UpdateOrganization>) {
        const updatedData = {
            id,
            ...data,
            updatedAt: new Date(),
        };
        if (data.password) updatedData.password = await hashPassword(data.password);
        return this.organizationRepository.update(updatedData);
    }
    
    async deleteOrganization(id: string) {
        const organization = await this.organizationRepository.delete(id);
        if (!organization) throw new NotFoundError('Could not find organization with the given ID');
        return organization;
    }
    
    async getOrganizationMembers(id: string) {
        const members = await this.organizationRepository.getMembersByOrganizationId(id);
        if (!members) throw new NotFoundError('Organization not found', 404);
        return members;
    }

    async addOrganizationMember(organizationId: string, data: {userId: string, role: string}) { 
        const { userId, role } = data;
        if (!userId || !role) throw new BadRequestError('User ID and role are required');
        const organization = await this.organizationRepository.getById(organizationId);
        if (!organization) throw new NotFoundError('Organization not found');
        
        const member = await this.organizationRepository.addMember(organizationId, userId, role);
        if (!member) throw new HttpError('InternalServerError', 'Failed to add member to organization', 500);
        
        return member;
    }

    async updateOrganizationMember(organizationId: string, userId: string, role: string) {
        if (!organizationId || !userId || !role) throw new BadRequestError('Organization ID, User ID and role are required');
        
        const updatedMember = await this.organizationRepository.updateMember(organizationId, userId, role);
        if (!updatedMember) throw new HttpError('InternalServerError', 'Failed to delete member from organization', 500);
        if (updatedMember.length === 0) throw new NotFoundError('Member not found in organization', 404);

        return [updatedMember];
    }
    
    async deleteOrganizationMember(organizationId: string, userId: string) {
        if (!organizationId || !userId) throw new BadRequestError('Organization ID and User ID are required');
        const organization = await this.organizationRepository.getById(organizationId);
        if (!organization) throw new NotFoundError('Organization not found');
        
        const deletedMember = await this.organizationRepository.deleteMember(organizationId, userId);
        if (!deletedMember) throw new HttpError('InternalServerError', 'Failed to delete member from organization', 500);
        if (deletedMember.length === 0) throw new NotFoundError('Member not found in organization', 404);
        
        return [deletedMember];
    }

    async getOrganizationAssets(id: string) {
        const assets = await this.organizationRepository.getAssetsByOrganizationId(id);
        if (!assets) throw new NotFoundError('Organization not found', 404);
        return assets;
    }

    async activateOrganization(id: string) {
        return this.organizationRepository.setActive(id, true);
    }
    
    async deactivateOrganization(id: string) {
        return this.organizationRepository.setActive(id, false);
    }
    
    async getOrganizationReports(id: string) {
        const reports = await this.organizationRepository.getReportsByOrganizationId(id);
        return reports;
    }

    async getUserOrganizations(userId: string) {
        if (!userId) throw new BadRequestError('User ID is required');
        const orgs = await this.organizationRepository.getOrganizationsByUserId(userId);
        return orgs;
    }

    async sendOrganizationInvite(email: string, organizationId: string, frontendBaseUrl: string): Promise<boolean> {
        if (!email || !organizationId) throw new BadRequestError('Email and organizationId are required');
        // Optionally, validate organization exists
        const organization = await this.organizationRepository.getById(organizationId);
        if (!organization) throw new NotFoundError('Organization not found', 404);
        // Compose invite link
        const inviteUrl = `${frontendBaseUrl}/organization/accept?org=${organizationId}&email=${encodeURIComponent(email)}`;
        const subject = `Convite para entrar na organização ${organization.name}`;
        const htmlContent = `<p>Você foi convidado para entrar na organização <b>${organization.name}</b>.</p>
            <p><a href="${inviteUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;">Aceitar convite</a></p>`;
        const emailService = new EmailService();
        return await emailService.sendEmail({
            sender: { email: 'lfbalaminute@hotmail.com', name: 'Stuff App' },
            to: [{ email }],
            subject,
            htmlContent
        });
    }
}