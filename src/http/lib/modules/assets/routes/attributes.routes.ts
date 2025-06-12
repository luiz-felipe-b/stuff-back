import { db } from "../../../../../db/connection";
import { AttributesController } from "../controllers/attributes.controller";
import { attributesRoutesDocs } from "../docs/attributes.doc";
import { AttributesRepository } from "../repositories/attributes.repository";
import { AttributesService } from "../services/attributes.service";

export async function attributesRoutes(app) {
    const attributesRepository = new AttributesRepository(db);
    const attributesService = new AttributesService(attributesRepository);
    const attributesController = new AttributesController(attributesService);

    app.get('/', {
        onRequest: [app.authenticate],
        schema: attributesRoutesDocs.getAllAttributes
    }, attributesController.getAllAttributes.bind(attributesController));

    app.post('/', {
        onRequest: [app.authenticate],
        schema: attributesRoutesDocs.createAttribute
    }, attributesController.createAttribute.bind(attributesController));

    app.post('/:attributeId/value', {
        onRequest: [app.authenticate],
        schema: attributesRoutesDocs.createAttributeValue
    }, attributesController.createAttributeValue.bind(attributesController));

    // app.get('/:id', {
    //     onRequest: [app.authenticate],
    //     schema: attributesRoutesDocs.getAttributeById
    // }, attributesController.getAttributeById.bind(attributesController));
}