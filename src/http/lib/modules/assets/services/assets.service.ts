import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AssetsRepository } from "../repositories/assets.repository";
import { Asset, AssetWithAttributes, CreateAsset, createAssetSchema, UpdateAsset, updateAssetSchema } from "../schemas/assets.schema";
import { v4 as uuidv4 } from "uuid";

export class AssetsService {
    private assetsRepository: AssetsRepository;

    constructor(assetsRepository: AssetsRepository) {
        this.assetsRepository = assetsRepository;
    }

    async createAsset(data: CreateAsset): Promise<Asset> {
        const dataValidation = createAssetSchema.safeParse(data);
        if (!dataValidation.success) throw new BadRequestError('Invalid asset instance data', 400);
        const { type, quantity, templateId, organizationId, creatorUserId, name, description } = data;

        const result = await this.assetsRepository.createAsset({
            id: uuidv4(),
            type,
            quantity: quantity || null,
            organizationId: organizationId || null,
            creatorUserId,
            name,
            description: description || "Default description",
            trashBin: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        if (!result) throw new InternalServerError("Failed to create asset instance");
        return result;
    }

    async getAllAssets(): Promise<{ assets: Asset[] }> {
        const result = await this.assetsRepository.getAllAssets();
        if (!result) {
            throw new InternalServerError("Failed to fetch assets");
        }
        const organizedAssets = { assets: [] as Asset[] };
        for (const asset of result) {
            organizedAssets.assets.push(asset);
        }
        return organizedAssets;
    }

    async getAllAssetsWithAttributes(): Promise<{ assets: AssetWithAttributes[] }> {
        const result = await this.assetsRepository.getAllAssetsWithAttributes();
        if (!result || result.length === 0) {
            throw new InternalServerError("Failed to fetch assets with attributes");
        }
        // Group by asset id
        const assetMap = new Map<string, AssetWithAttributes>();
        for (const row of result) {
            const assetRow = row.assets;
            if (!assetMap.has(assetRow.id)) {
                assetMap.set(assetRow.id, {
                    id: assetRow.id,
                    organizationId: assetRow.organizationId,
                    quantity: assetRow.quantity,
                    creatorUserId: assetRow.creatorUserId,
                    name: assetRow.name,
                    description: assetRow.description,
                    trashBin: assetRow.trashBin,
                    createdAt: assetRow.createdAt,
                    updatedAt: assetRow.updatedAt,
                    type: assetRow.type,
                    attributes: []
                });
            }
            if (row.attributes && row.attributes.id) {
                const attributeObj = {
                    ...row.attributes,
                    value: row.attribute_values ? row.attribute_values : null
                };
                assetMap.get(assetRow.id)!.attributes.push(attributeObj);
            }
        }
        return { assets: Array.from(assetMap.values()) };
    }

    async getAssetWithAttributes(assetId: string): Promise<AssetWithAttributes> {
        if (!assetId) throw new BadRequestError('Asset ID is required', 400);
        const result = await this.assetsRepository.getAssetWithAttributes(assetId);
        if (!result || result.length === 0 || !result[0].assets) {
            throw new BadRequestError(`Asset instance with id ${assetId} not found`, 404);
        }
        // Extract asset fields from the first row's assets
        const assetRow = result[0].assets;
        const asset: AssetWithAttributes = {
            id: assetRow.id,
            organizationId: assetRow.organizationId,
            quantity: assetRow.quantity,
            creatorUserId: assetRow.creatorUserId,
            name: assetRow.name,
            description: assetRow.description,
            trashBin: assetRow.trashBin,
            createdAt: assetRow.createdAt,
            updatedAt: assetRow.updatedAt,
            type: assetRow.type,
            attributes: []
        };
        // Group attribute values by attribute id
        const attrMap: Record<string, any> = {};
        for (const row of result) {
            if (row.attributes && row.attributes.id) {
                const attrId = row.attributes.id;
                if (!attrMap[attrId]) {
                    attrMap[attrId] = {
                        ...row.attributes,
                        values: []
                    };
                }
                if (row.attribute_values && row.attribute_values.id) {
                    const val = row.attribute_values;
                    attrMap[attrId].values.push({
                        id: val.id,
                        assetInstanceId: val.assetInstanceId || val.asset_id,
                        attributeId: val.attributeId || val.attribute_id,
                        value: val.value,
                        createdAt: val.createdAt || val.created_at,
                        updatedAt: val.updatedAt || val.updated_at
                    });
                }
            }
        }
        asset.attributes = Object.values(attrMap);
        return asset;
    }

    async editAsset(assetId: string, data: UpdateAsset): Promise<Asset> {
        if (!assetId) throw new BadRequestError('Asset ID is required', 400);
        const dataValidation = updateAssetSchema.safeParse(data);
        if (!dataValidation.success) throw new BadRequestError('Invalid asset update data', 400);
        const updated = await this.assetsRepository.editAsset(assetId, dataValidation.data);
        if (!updated) throw new InternalServerError('Failed to update asset');
        return updated;
    }
    async deleteAsset(assetId: string): Promise<void> {
        if (!assetId) throw new BadRequestError('Asset ID is required', 400);
        const deleted = await this.assetsRepository.deleteAsset(assetId);
        console.log(deleted);
        if (!deleted) throw new InternalServerError('Failed to delete asset');
    }

    // Set the trashBin field for an asset
    async setAssetTrashBin(assetId: string, trashBin: boolean): Promise<Asset> {
        if (!assetId) throw new BadRequestError('Asset ID is required', 400);
        if (typeof trashBin !== 'boolean') throw new BadRequestError('trashBin must be a boolean', 400);
        const updated = await this.assetsRepository.setAssetTrashBin(assetId, trashBin);
        if (!updated) throw new InternalServerError('Failed to update asset trashBin');
        return updated;
    }
}