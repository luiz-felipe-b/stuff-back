import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

import { env } from "../../../../../env";

const MODEL_ID = "amazon.nova-lite-v1:0";

const region = env.AWS_REGION;
const profile = env.AWS_PROFILE;

export class AIService {
    private client: BedrockRuntimeClient;
    constructor() {
        this.client = new BedrockRuntimeClient({ region: region, credentials: fromNodeProviderChain({ profile: profile }) });
    }

    async invokeNova(prompt: string): Promise<string> {
        const payload = {
            max_tokens: 512,
            temperature: 0.5,
            messages: [
                { role: "user", content: prompt }
            ]
        };
        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });
        const response = await this.client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.content?.[0]?.text ?? "";
    }
}
