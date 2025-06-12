import { Database, Transaction } from "../../../../../types/db/database";
import { assetInstances } from "../../../../../db/schemas/assets/assets-instances.schema";
import { assetTemplates } from "../../../../../db/schemas/assets/assets-templates.schema";
import { eq } from "drizzle-orm";
import { AssetInstance } from "../schemas/assets-instances.schema";
import { AssetTemplate } from "../schemas/assets-templates.schema";

export class AssetsRepository {
    constructor(private readonly db: Database | Transaction) { }

    async createAssetInstance(data: AssetInstance): Promise<AssetInstance> {
        const [result] = (await this.db
            .insert(assetInstances)
            .values(data)
            .returning()) as AssetInstance[];
        return result;
    }

    async createAssetTemplate(data: Omit<AssetTemplate, "createdAt" | "updatedAt">): Promise<AssetTemplate> {
        const [result] = (await this.db
            .insert(assetTemplates)
            .values(data)
            .returning()) as AssetTemplate[];
        return result;
    }

    async getAllAssets(): Promise<any[]> {
        const result = await this.db
            .select()
            .from(assetInstances)
            .fullJoin(assetTemplates, eq(assetInstances.templateId, assetTemplates.id));
        return result;
    }
}