import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AssetsRepository } from "../repositories/assets.repository";
import { Asset, AssetWithAttributes, CreateAsset, createAssetSchema } from "../schemas/assets.schema";
import { v4 as uuidv4 } from "uuid";
import { AttributeWithValues } from "../schemas/attributes.schema";

export class AssetsService {
    async deleteAsset(assetId: string): Promise<void> {
        if (!assetId) throw new BadRequestError('Asset ID is required', 400);
        // Check existence
        const asset = await this.assetsRepository.getAssetWithAttributes(assetId);
        if (!asset || (Array.isArray(asset) && asset.length === 0)) {
            throw new BadRequestError('Asset not found', 404);
        }
        const deleted = await this.assetsRepository.deleteAsset(assetId);
        if (!deleted) throw new InternalServerError('Failed to delete asset');
    }
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

    async getAllAssets(): Promise<{
        assets_instances: Asset[];
    }> {
        const result = await this.assetsRepository.getAllAssets();

        if (!result) {
            throw new InternalServerError("Failed to fetch assets");
        }
        const organizedAssets = {
            assets_instances: [] as Asset[]
        };

        // Categorize each asset based on whether it has a templateId
        for (const asset of result) {
            if (asset.assets_instances) {
                organizedAssets.assets_instances.push(asset.assets_instances);
            }
        }

        return organizedAssets;
    }

    async getAssetWithAttributes(assetInstanceId: string): Promise<AssetWithAttributes> {
        if (!assetInstanceId) throw new BadRequestError('Asset instance ID is required', 400);
        const result = await this.assetsRepository.getAssetWithAttributes(assetInstanceId);
        if (!result || result.length === 0) {
            throw new InternalServerError("Failed to fetch asset with attributes");
        }
        // Check if asset instance exists
        const assetInstanceData = result[0].assets_instances;
        if (!assetInstanceData) {
            throw new BadRequestError(`Asset instance with id ${assetInstanceId} not found`, 404);
        }
        // Process the result to return a structured AssetInstanceWithAttributes
        const assetInstance: AssetWithAttributes = {
            id: assetInstanceData.id,
            organizationId: assetInstanceData.organizationId,
            quantity: assetInstanceData.quantity,
            creatorUserId: assetInstanceData.creatorUserId,
            name: assetInstanceData.name,
            description: assetInstanceData.description,
            trashBin: assetInstanceData.trashBin,
            createdAt: assetInstanceData.createdAt,
            updatedAt: assetInstanceData.updatedAt,
            attributes: [],
            type: "unique"
        };
        // Collect unique attributes with their values
        const attributeMap = new Map();
        for (const row of result) {
            if (row.attributes) {
                const attrId = row.attributes.id;
                if (!attributeMap.has(attrId)) {
                    attributeMap.set(attrId, {
                        ...row.attributes,
                        values: []
                    });
                }
                const attribute = attributeMap.get(attrId);
                if (row.asset_attribute_values) {
                    attribute.values.push(row.asset_attribute_values);
                }
            }
        }
        assetInstance.attributes = Array.from(attributeMap.values());
        return assetInstance;
    }
}