import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../common/controllers/controller";
import { OrganizationService } from "./organizations.service";
import { z } from "zod";
import app from "../../../app";

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
        // Validate the request headers
        const headerValidation = z.object({
            authorization: z.string({ message: 'Authorization header is required' }).min(1, { message: 'Authorization header is required' })
        });
        const validatedHeader = headerValidation.safeParse(request.headers);
        if (!validatedHeader.success) {
            return reply.code(400).send({ message: validatedHeader.error.errors[0].message });
        }
        const { authorization } = validatedHeader.data;
        const decodedAuthorization = app.jwt.decode(authorization.split(' ')[1]);
        if (!decodedAuthorization) {
            return reply.code(401).send({ message: 'Unauthorized' });
        }
        const { userId } = decodedAuthorization as { userId: string };

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
            ownerId: userId,
        });
        return result;
    }

    async updateOrganization(request:FastifyRequest, reply:FastifyReply) {
        return;
    }

    async deleteOrganization(request:FastifyRequest, reply:FastifyReply) {
        return;
    }
}