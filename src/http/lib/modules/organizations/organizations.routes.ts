import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance";
import { authorizeUserAccess } from "../../util/permission/authorize-permission";
import { organizationRouteDocs } from "./docs/organizations.docs";
import { OrganizationController } from "./organizations.controller";
import { OrganizationRepository } from "./organizations.repository";
import { OrganizationService } from "./organizations.service";

export async function organizationsRoutes(app: FastifyTypedInstance) {
  const organizationRepository = new OrganizationRepository();
  const organizationService = new OrganizationService(organizationRepository);
  const organizationController = new OrganizationController(organizationService);

  app.get('/', {
    onRequest: [app.authenticate],
    preHandler: [authorizeUserAccess(['admin'])],
    schema: organizationRouteDocs.getAllOrganizations
  }, organizationController.getAllOrganizations.bind(organizationController));

  app.get('/:identifier', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.getOrganizationByIdentifier
  }, organizationController.getOrganizationByIdentifier.bind(organizationController));

  app.post('/', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.createOrganization,
    attachValidation: true
  }, organizationController.createOrganization.bind(organizationController));

  // app.patch('/:id', {
  //   onRequest: [app.authenticate],
  //   schema: organizationRouteDocs.updateOrganization
  // }, organizationController.updateOrganization.bind(organizationController));

  // app.delete('/:id', {
  //   onRequest: [app.authenticate],
  //   schema: organizationRouteDocs.deleteOrganization
  // }, organizationController.deleteOrganization.bind(organizationController));
}