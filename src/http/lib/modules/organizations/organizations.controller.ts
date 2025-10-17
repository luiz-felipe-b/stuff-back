import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../common/controllers/controller";
import { OrganizationService } from "./organizations.service";
import { z } from "zod";
import app from "../../../app";
import { organizationIdentifierParamSchema, organizationIdParamSchema, updateOrganizationSchema } from "./organizations.schema";
import { BadRequestError } from "../../util/errors/bad-request.error";
import { NotFoundError } from "../../util/errors/not-found.error";

export class OrganizationController extends Controller {
    private organizationService: OrganizationService;

    constructor(organizationService: OrganizationService) {
        super();
        this.organizationService = organizationService;
    }

    async getAllOrganizations(request:FastifyRequest, reply:FastifyReply) {
        return this.handleRequest(request, reply, async () => {
            const organizations = await this.organizationService.getAllOrganizations();
            return reply.code(200).send({ data: organizations, message: 'Organizations found' });
        });
    }

    async getOrganizationByIdentifier(request:FastifyRequest, reply:FastifyReply) {
        return this.handleRequest(request, reply, async () => {
            const identififierValidation = z.object({
                identifier: z.string({message: 'Identifier needs to be a string'}).min(1, { message: 'Identifier is required' })
            })
            const validatedIdentifier = identififierValidation.safeParse(request.params);
            if (!validatedIdentifier.success) throw new BadRequestError(validatedIdentifier.error.errors[0].message);
            const { identifier } = validatedIdentifier.data;
            const organization = await this.organizationService.getOrganizationByIdentifier(identifier);
            return reply.code(200).send({ data: organization, message: 'Organization found' });
        });
    }

    async createOrganization(request:FastifyRequest, reply:FastifyReply) {
        // Validate the request user
        if (!request.user || !request.user.id) throw new BadRequestError('User is required to create an organization');
        // Validate the request body
        const bodyValidation = z.object({
            name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
            slug: z.string({ message: 'Slug is required' }).min(1, { message: 'Slug is required' }),
            description: z.string().optional(),
            password: z.string().optional(),
        });
        const validatedBody = bodyValidation.safeParse(request.body);
        if (!validatedBody.success) throw new BadRequestError(validatedBody.error.errors[0].message);
        const result = await this.organizationService.createOrganization({
            ...validatedBody.data,
            ownerId: request.user.id,
        });
        return result;
    }

    async updateOrganization(request:FastifyRequest, reply:FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) throw new BadRequestError(params.error.errors[0].message);

        const body = updateOrganizationSchema.safeParse(request.body);
        if (!body.success) throw new BadRequestError(body.error.errors[0].message);
        const { id } = params.data;

        const updatedOrganization = await this.organizationService.updateOrganization(id, body.data);
        if (!updatedOrganization) throw new NotFoundError('Organization not found', 404);

        return reply.code(200).send({ data: updatedOrganization, message: 'Organization updated successfully' });
    }

    async deleteOrganization(request:FastifyRequest, reply:FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) throw new BadRequestError(params.error.errors[0].message);
        const { id } = params.data;
        
        const deletedOrganization = await this.organizationService.deleteOrganization(id);

        if (!deletedOrganization) throw new NotFoundError('Organization not found', 404);
        return reply.code(200).send({ message: 'Organization deleted successfully' });
    }

    async getOrganizationMembers(request:FastifyRequest, reply:FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) throw new BadRequestError(params.error.errors[0].message);
        const { id } = params.data;

        const members = await this.organizationService.getOrganizationMembers(id);
        if (!members) throw new NotFoundError('Organization not found');
        console.log('Members:', members);

        return reply.code(200).send({ data: members, message: 'Organization members found' });
    }

    async addOrganizationMember(request:FastifyRequest, reply:FastifyReply) {
        const validatedParams = organizationIdParamSchema.safeParse(request.params);
        if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
        const { id } = validatedParams.data;

        const bodyValidation = z.object({
            userId: z.string({ message: 'User ID is required' }).min(1, { message: 'User ID is required' }),
            role: z.enum(['admin', 'moderator', 'user'], { message: 'Role must be one of admin, moderator, or user' }),
        });
        const validatedBody = bodyValidation.safeParse(request.body);
        if (!validatedBody.success) throw new BadRequestError(validatedBody.error.errors[0].message);

        const member = await this.organizationService.addOrganizationMember(id, validatedBody.data);
        return reply.code(201).send({ data: member, message: 'Member added to organization' });
    }

    async updateOrganizationMember(request:FastifyRequest, reply:FastifyReply) {
        const validatedParams = z.object({
            id: z.string({ message: 'Organization ID is required' }).min(1, { message: 'Organization ID is required' }),
            userId: z.string({ message: 'User ID is required' }).min(1, { message: 'User ID is required' }),
        }).safeParse(request.params);
        if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);

        const validatedBody = z.object({
            role: z.enum(['admin', 'moderator', 'user'], { message: 'Role must be one of admin, moderator, or user' }),
        }).safeParse(request.body);
        if (!validatedBody.success) throw new BadRequestError(validatedBody.error.errors[0].message);

        const { id: organizationId , userId } = validatedParams.data;
        const { role } = validatedBody.data;

        const updatedMember = await this.organizationService.updateOrganizationMember(organizationId, userId, role);
        if (!updatedMember) throw new NotFoundError('Organization member not found', 404);

        return reply.code(200).send({ data: updatedMember, message: 'Organization member updated successfully' });
    }

    async deleteOrganizationMember(request:FastifyRequest, reply:FastifyReply) {
        const validatedParams = z.object({
            id: z.string({ message: 'Organization ID is required' }).min(1, { message: 'Organization ID is required' }),
            userId: z.string({ message: 'User ID is required' }).min(1, { message: 'User ID is required' }),
        }).safeParse(request.params);
        if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);

        const { id: organizationId, userId } = validatedParams.data;

        const deletedMember = await this.organizationService.deleteOrganizationMember(organizationId, userId);
        if (!deletedMember) throw new NotFoundError('Organization member not found', 404);

        return reply.code(200).send({ message: 'Organization member deleted successfully' });
    }

    async getOrganizationAssets(request: FastifyRequest, reply: FastifyReply) {
        const validatedParams = organizationIdParamSchema.safeParse(request.params);
        if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
        const { id } = validatedParams.data;

        const assets = await this.organizationService.getOrganizationAssets(id);
        if (!assets) throw new NotFoundError('Organization not found', 404);

        return reply.code(200).send({ data: assets, message: 'Organization assets found' });
    }

        async activateOrganization(request: FastifyRequest, reply: FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) throw new BadRequestError(params.error.errors[0].message);
        const { id } = params.data;
        const updated = await this.organizationService.activateOrganization(id);
        if (!updated) throw new NotFoundError('Organization not found', 404);
        return reply.code(200).send({ data: updated, message: 'Organization activated' });
    }

    async deactivateOrganization(request: FastifyRequest, reply: FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) throw new BadRequestError(params.error.errors[0].message);
        const { id } = params.data;
        const updated = await this.organizationService.deactivateOrganization(id);
        if (!updated) throw new NotFoundError('Organization not found', 404);
        return reply.code(200).send({ data: updated, message: 'Organization deactivated' });
    }

    async getUserOrganizations(request: FastifyRequest, reply: FastifyReply) {
        return this.handleRequest(request, reply, async () => {
            const params = z.object({ userId: z.string().min(1, { message: 'User ID is required' }) }).safeParse(request.params);
            if (!params.success) throw new BadRequestError(params.error.errors[0].message);
            const { userId } = params.data;
            const orgs = await this.organizationService.getUserOrganizations(userId);
            return reply.code(200).send({ data: orgs, message: 'User organizations found' });
        });
    }

    async getOrganizationReports(request: FastifyRequest, reply: FastifyReply) {
        return this.handleRequest(request, reply, async () => {
            const params = z.object({ id: z.string().uuid() }).safeParse(request.params);
            if (!params.success) throw new BadRequestError(params.error.errors[0].message);
            const { id } = params.data;
            const reports = await this.organizationService.getOrganizationReports(id);
            return reply.code(200).send({ data: reports, message: 'Organization reports found' });
        });
    }
}