import { db } from "../../../../db/connection";
import { FastifyTypedInstance } from "../../../../types/fastify-typed-instance";
import { authorizeUserAccess } from "../../util/permission/authorize-permission";
import { organizationRouteDocs } from "./docs/organizations.docs";
import { OrganizationController } from "./organizations.controller";
import { OrganizationRepository } from "./organizations.repository";
import { OrganizationService } from "./organizations.service";

export async function organizationsRoutes(app: FastifyTypedInstance) {
  const organizationRepository = new OrganizationRepository(db);
  const organizationService = new OrganizationService(organizationRepository);
  const organizationController = new OrganizationController(organizationService);

  app.get('/', {
    onRequest: [app.authenticate],
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

  app.patch('/:id', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.updateOrganization
  }, organizationController.updateOrganization.bind(organizationController));

  app.delete('/:id', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.deleteOrganization
  }, organizationController.deleteOrganization.bind(organizationController));

  app.get('/:id/members', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.getOrganizationMembers
  }, organizationController.getOrganizationMembers.bind(organizationController));

  app.post('/:id/members', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.addOrganizationMember
  }, organizationController.addOrganizationMember.bind(organizationController));

  app.patch('/:id/members/:userId', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.updateOrganizationMember
  }, organizationController.updateOrganizationMember.bind(organizationController));

  app.delete('/:id/members/:userId', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.deleteOrganizationMember
  }, organizationController.deleteOrganizationMember.bind(organizationController));

  app.get('/:id/assets', {
    onRequest: [app.authenticate],
    schema: organizationRouteDocs.getOrganizationAssets,
  }, organizationController.getOrganizationAssets.bind(organizationController));
}