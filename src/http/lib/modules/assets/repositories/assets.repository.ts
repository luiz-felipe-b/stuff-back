import { Database, Transaction } from "../../../../../types/db/database";
import { assets } from "../../../../../db/schemas/assets/assets.schema";import { eq, or } from "drizzle-orm";
import { Asset } from "../schemas/assets.schema";
import { attributes } from "../../../../../db/schemas/assets/schemas";
import { attributeValues } from "../../../../../db/schemas/assets/attributes/attribute-values.schema";
import { Attribute } from "../schemas/attributes.schema";

export class AssetsRepository {
    async deleteAsset(assetId: string): Promise<boolean> {
        await this.db.delete(attributeValues).where(eq(attributeValues.assetInstanceId, assetId));
        const result = await this.db.delete(assets).where(eq(assets.id, assetId));
        return result.rowCount > 0;
    }
    constructor(private readonly db: Database | Transaction) { }

    async createAsset(data: Asset): Promise<Asset> {
        const [result] = (await this.db
            .insert(assets)
            .values(data)
            .returning()) as Asset[];
        return result;
    }

    async getAllAssets(): Promise<any[]> {
        const result = await this.db
            .select()
            .from(assets)
        return result;
    }

    async getAssetWithAttributes(assetInstanceId: string): Promise<any[]> {
        const result = await this.db
            .select()
            .from(assets)
            .leftJoin(attributeValues, eq(assets.id, attributeValues.assetInstanceId))
            .leftJoin(attributes, eq(attributeValues.attributeId, attributes.id))
            .where(eq(assets.id, assetInstanceId));
        return result;
    }
}