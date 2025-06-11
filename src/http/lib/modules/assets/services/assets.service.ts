import { BadRequestError } from "../../../util/errors/bad-request.error";
import { InternalServerError } from "../../../util/errors/internal-server-error";
import { AssetsRepository } from "../repositories/assets.repository";
import { AssetInstance, CreateAssetInstance, createAssetInstanceSchema } from "../schemas/assets-instances.schema";
import { v4 as uuidv4 } from "uuid";
import { AssetTemplate, CreateAssetTemplate, createAssetTemplateSchema } from "../schemas/assets-templates.schema";

export class AssetsService {
    private assetsRepository: AssetsRepository;

    constructor(assetsRepository: AssetsRepository) {
        this.assetsRepository = assetsRepository;
    }

    async createAssetInstance(data: CreateAssetInstance): Promise<AssetInstance> {
        const dataValidation = createAssetInstanceSchema.safeParse(data);
        if (!dataValidation.success) throw new BadRequestError('Invalid asset instance data', 400);
        const { templateId, organizationId, creatorUserId, name, description } = data;

        const result = await this.assetsRepository.createAssetInstance({
            id: uuidv4(),
            templateId: templateId || null, // Allow templateId to be optional
            organizationId: organizationId || null, // Allow organizationId to be optional
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

    async createAssetTemplate(data: CreateAssetTemplate): Promise<AssetTemplate> {
        const dataValidation = createAssetTemplateSchema.safeParse(data);
        if (!dataValidation.success) throw new BadRequestError('Invalid asset template data', 400);
        const { name, description, organizationId, creatorUserId } = data;

        const result = await this.assetsRepository.createAssetTemplate({
            id: uuidv4(),
            name,
            description: description || "Default description",
            organizationId: organizationId || null,
            creatorUserId,
            trashBin: false,
        });
        if (!result) throw new InternalServerError("Failed to create asset instance");
        return result;
    }

    async getAllAssets(): Promise<{
        assets_templates: AssetTemplate[];
        assets_instances: AssetInstance[];
    }> {
        const result = await this.assetsRepository.getAllAssets();

        if (!result) {
            throw new InternalServerError("Failed to fetch assets");
        }
        // Organize assets into templates and instances
        const organizedAssets = {
            assets_templates: [] as AssetTemplate[],
            assets_instances: [] as AssetInstance[]
        };

        // Categorize each asset based on whether it has a templateId
        for (const asset of result) {
            if (asset.assets_instances) {
                organizedAssets.assets_instances.push(asset.assets_instances);
            } else {
                organizedAssets.assets_templates.push(asset.assets_templates);
            }
        }

        return organizedAssets;
    }
}