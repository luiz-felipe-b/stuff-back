import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../common/controllers/controller";
import { OrganizationService } from "./organizations.service";

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
    

    async getOrganizationById(request:FastifyRequest, reply:FastifyReply) {
        return;
    }

    async createOrganization(request:FastifyRequest, reply:FastifyReply) {
        return;
    }

    async updateOrganization(request:FastifyRequest, reply:FastifyReply) {
        return;
    }

    async deleteOrganization(request:FastifyRequest, reply:FastifyReply) {
        return;
    }
}