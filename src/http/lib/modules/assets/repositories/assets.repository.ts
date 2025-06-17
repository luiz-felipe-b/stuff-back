import { Database, Transaction } from "../../../../../types/db/database";
import { assetInstances } from "../../../../../db/schemas/assets/assets-instances.schema";
import { assetTemplates } from "../../../../../db/schemas/assets/assets-templates.schema";
import { eq, or } from "drizzle-orm";
import { AssetInstance } from "../schemas/assets-instances.schema";
import { AssetTemplate } from "../schemas/assets-templates.schema";
import { attributes, dateValues, metricUnitValues, numberValues, textValues } from "../../../../../db/schemas/assets/schemas";
import { DateValue, MetricValue, NumberValue, TextValue } from "../schemas/attribute-values.schema";
import { Attribute } from "../schemas/attributes.schema";

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

    async getAssetWithAttributes(assetInstanceId: string): Promise<{assets_instances: AssetInstance | null, attributes: Attribute, number_values: NumberValue | null, text_values: TextValue | null, date_values: DateValue | null, metric_unit_values: MetricValue | null}[]> { 
        const result = await this.db
            .select()
            .from(assetInstances)
            .leftJoin(numberValues, eq(assetInstances.id, numberValues.assetInstanceId))
            .leftJoin(textValues, eq(assetInstances.id, textValues.assetInstanceId))
            .leftJoin(dateValues, eq(assetInstances.id, dateValues.assetInstanceId))
            .leftJoin(metricUnitValues, eq(assetInstances.id, metricUnitValues.assetInstanceId))
            .leftJoin(attributes, or(
                eq(numberValues.attributeId, attributes.id), 
                eq(textValues.attributeId, attributes.id), 
                eq(dateValues.attributeId, attributes.id), 
                eq(metricUnitValues.attributeId, attributes.id)
            )).where(eq(assetInstances.id, assetInstanceId));
        return result as {assets_instances: AssetInstance | null, attributes: Attribute, number_values: NumberValue | null, text_values: TextValue | null, date_values: DateValue | null, metric_unit_values: MetricValue | null}[];
    }
}