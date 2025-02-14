import { FastifyRequest, FastifyReply } from "fastify";
import { Controller } from "../../../common/controllers/controller";
import { OrganizationsService } from "../services/organizations-service";
import { Organization } from "../models/organization-model";

export class OrganizationsController extends Controller {
    private organizationsService: OrganizationsService;

    constructor(organizationsService: OrganizationsService) {
        super();
        this.organizationsService = organizationsService;
    }

    async getOrganizationById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organization = await this.organizationsService.getOrganizationById(req);
            return reply.code(200).send(organization);
        });
    }

    async getOrganizationByCode(req: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organization = await this.organizationsService.getOrganizationByCode(req);
            return reply.code(200).send(organization);
        });
    }

    async getAllOrganizations(req: FastifyRequest, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organizations = await this.organizationsService.getAllOrganizations();
            return reply.code(200).send(organizations);
        });
    }

    async createOrganization(req: FastifyRequest<{ Body: Pick<Organization, 'authorId' | 'organizationCode' | 'name' | 'tier'> }>, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organization = await this.organizationsService.createOrganization(req);
            return reply.code(201).send(organization);
        });
    }

    async updateOrganization(req: FastifyRequest, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organization = await this.organizationsService.updateOrganization(req);
            return reply.code(200).send(organization);
        });
    }

    async deleteOrganization(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        return await this.handleRequest(req, reply, async () => {
            const organization = await this.organizationsService.deleteOrganization(req);
            return reply.code(200).send(organization);
        });
    }
}
