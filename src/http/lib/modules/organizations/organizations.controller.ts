import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../common/controllers/controller";
import { OrganizationService } from "./organizations.service";
import { z } from "zod";
import app from "../../../app";
import { organizationIdentifierParamSchema, organizationIdParamSchema, updateOrganizationSchema } from "./organizations.schema";

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
            if (!validatedIdentifier.success) {
                return reply.code(400).send({ message: validatedIdentifier.error.errors[0].message });
            }
            const { identifier } = validatedIdentifier.data;
            const organization = await this.organizationService.getOrganizationByIdentifier(identifier);
            return reply.code(200).send({ data: organization, message: 'Organization found' });
        });
    }

    async createOrganization(request:FastifyRequest, reply:FastifyReply) {
        // Validate the request body
        const bodyValidation = z.object({
            name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
            slug: z.string({ message: 'Slug is required' }).min(1, { message: 'Slug is required' }),
            description: z.string().optional(),
            password: z.string().optional(),
        });
        const validatedBody = bodyValidation.safeParse(request.body);
        if (!validatedBody.success) {
            return reply.code(400).send({ message: validatedBody.error.errors[0].message });
        }
        const result = await this.organizationService.createOrganization({
            ...validatedBody.data,
            ownerId: request.user.id,
        });
        return result;
    }

    async updateOrganization(request:FastifyRequest, reply:FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) return reply.code(400).send({ message: params.error.errors[0].message });
        const body = updateOrganizationSchema.safeParse(request.body);
        if (!body.success) return reply.code(400).send({ message: body.error.errors[0].message });
        const { id } = params.data;
        const updatedOrganization = await this.organizationService.updateOrganization(id, body.data);
        if (!updatedOrganization) return reply.code(404).send({ message: 'Organization not found' });
        return reply.code(200).send({ data: updatedOrganization, message: 'Organization updated successfully' });
    }

    async deleteOrganization(request:FastifyRequest, reply:FastifyReply) {
        const params = organizationIdParamSchema.safeParse(request.params);
        if (!params.success) return reply.code(400).send({ message: params.error.errors[0].message });
        const { id } = params.data;
        const deletedOrganization = await this.organizationService.deleteOrganization(id);
        if (!deletedOrganization) return reply.code(404).send({ message: 'Organization not found' });
        return reply.code(200).send({ message: 'Organization deleted successfully' });
    }
}