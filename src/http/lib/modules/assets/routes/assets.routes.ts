import { db } from "../../../../../db/connection";
import { FastifyTypedInstance } from "../../../../../types/fastify-typed-instance";
import { AssetsController } from "../controllers/assets.controller";
import { assetRouteDocs } from "../docs/assets.docs";
import { AssetsRepository } from "../repositories/assets.repository";
import { AssetsService } from "../services/assets.service";

export async function assetsRoutes(app: FastifyTypedInstance) {
    const assetsRepository = new AssetsRepository(db);
    const assetsService = new AssetsService(assetsRepository);
    const assetsController = new AssetsController(assetsService);

    app.get('/', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.getAllAssetsWithAttributes
    }, assetsController.getAllAssetsWithAttributes.bind(assetsController));

    // app.get('/', {
    //     onRequest: [app.authenticate],
    //     schema: assetRouteDocs.getAllAssets
    // }, assetsController.getAllAssets.bind(assetsController));

    app.get('/:id', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.getAssetById
    }, assetsController.getAssetById.bind(assetsController));

    app.post('/', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.createAssetInstance,
    }, assetsController.createAsset.bind(assetsController));

    app.patch('/:id', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.editAsset,
    }, assetsController.editAsset.bind(assetsController));
    
    app.delete('/:id', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.deleteAsset,
    }, assetsController.deleteAsset.bind(assetsController));

    // Set asset trashBin field
    app.patch('/:id/trash-bin', {
        onRequest: [app.authenticate],
        schema: assetRouteDocs.setAssetTrashBin,
    }, assetsController.setAssetTrashBin.bind(assetsController));
}
