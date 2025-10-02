import { AIService } from "../../ai/services/ai.service";

export class AIFunctionalitiesService {
    private aiService: AIService;
    constructor() {
        this.aiService = new AIService();
    }

    async describeImage(imageBase64: string, assetMetadata?: any, prompt?: string): Promise<any> {
        const description = await this.describeImage(imageBase64, prompt);
        // Stub: Compose asset object (replace with DB logic as needed)
        return {
            ...assetMetadata,
            description,
            registeredAt: new Date().toISOString()
        };
    }
}
