import { z } from "zod";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance";
import { OrganizationsController } from "./controllers/organizations-controller";
import { OrganizationsRepository } from "./repositories/organizations-repository";
import { OrganizationsService } from "./services/organizations-service";
import { OrganizationTiers } from "./definitions/enums/organization-tiers-enum";

export async function organizationsRoutes(app: FastifyTypedInstance) {
    const organizationsRepository = new OrganizationsRepository();
    const organizationsService = new OrganizationsService(organizationsRepository);
    const organizationsController = new OrganizationsController(organizationsService);

    app.get('/:id', {
        schema: {
            description: 'Get organization by id',
            tags: ['organizations'],
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.object({
                    users: z.array(z.object({
                        id: z.string(),
                        organizationId: z.string().nullable(),
                        firstName: z.string(),
                        lastName: z.string(),
                        email: z.string().email(),
                        type: z.enum(['admin', 'staff', 'root' ,'invited']),
                        active: z.boolean(),
                        authenticated: z.boolean(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                    }))
                })
            },
        },
    }, organizationsController.getOrganizationById.bind(organizationsController));

    app.get('/code/:code', organizationsController.getOrganizationByCode.bind(organizationsController));
    app.get('/', organizationsController.getAllOrganizations.bind(organizationsController));

    app.post('/', {
        onRequest: [app.authenticate],
        schema: {
            description: 'Create a new organization',
            tags: ['organizations'],
            body: z.object({
                name: z.string(),
                authorId: z.string(),
                organizationCode: z.string(),
                tier: z.nativeEnum(OrganizationTiers),
            }),
            response: {
                200: z.object({
                    id: z.string(),
                    authorId: z.string(),
                    name: z.string(),
                    organizationCode: z.string(),
                    tier: z.nativeEnum(OrganizationTiers),
                    createdAt: z.date(),
                    updatedAt: z.date(),
                })
            },
        }
    }, organizationsController.createOrganization.bind(organizationsController));
    app.put('/:id', organizationsController.updateOrganization.bind(organizationsController));
    app.delete('/:id', organizationsController.deleteOrganization.bind(organizationsController));
}
