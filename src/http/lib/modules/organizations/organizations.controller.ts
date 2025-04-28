import { Controller } from "../../common/controllers/controller";
import { OrganizationService } from "./organizations.service";

export class OrganizationController extends Controller {
    private organizationService: OrganizationService;

    constructor(organizationService: OrganizationService) {
        super();
        this.organizationService = organizationService;
    }

    async getAllOrganizations(request, reply) {
        return;
    }

    async getOrganizationById(request, reply) {
        return;
    }

    async createOrganization(request, reply) {
        return;
    }

    async updateOrganization(request, reply) {
        return;
    }

    async deleteOrganization(request, reply) {
        return;
    }
}