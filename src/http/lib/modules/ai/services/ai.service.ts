import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

import { env } from "../../../../../env";

const MODEL_ID = "anthropic.claude-3-5-sonnet-20240620-v1:0";


const region = env.AWS_REGION;

// Use dedicated Bedrock credentials from env
const bedrockAccessKeyId = env.AWS_ACCESS_KEY_ID;
const bedrockSecretAccessKey = env.AWS_SECRET_ACCESS_KEY;

if (!bedrockAccessKeyId || !bedrockSecretAccessKey) {
    throw new Error("Missing AWS Bedrock credentials: AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not set in .env");
}

export class AIService {
    private client: BedrockRuntimeClient;
    constructor() {
        this.client = new BedrockRuntimeClient({
            region: region,
            credentials: {
                accessKeyId: bedrockAccessKeyId!,
                secretAccessKey: bedrockSecretAccessKey!,
            },
        });
    }

    /**
     * Envia uma imagem (base64) e um prompt para o Claude 3 Bedrock, sensível à extensão da imagem.
     * @param imageBase64 Imagem codificada em base64
     * @param prompt Prompt textual
     * @param extension Extensão da imagem (ex: 'png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'). Default: 'png'.
     */
    async invokeClaudeWithImage(imageBase64: string, prompt: string, extension: string = "png"): Promise<any> {
        // Map extension to media type
        const ext = extension.trim().toLowerCase();
        const extToMediaType: Record<string, string> = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            webp: "image/webp",
            gif: "image/gif",
            bmp: "image/bmp",
            tiff: "image/tiff"
        };
        if (!extToMediaType[ext]) {
            throw new Error(`Extensão de imagem não suportada: ${extension}`);
        }
        const mediaType = extToMediaType[ext];
        // Claude 3 Bedrock optimal multimodal payload: image block (with source) first, then text block, and anthropic_version
        const payload = {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mediaType,
                                data: imageBase64
                            }
                        },
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ],
            max_tokens: 1000,
            anthropic_version: "bedrock-2023-05-31"
        };
        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });
        const response = await this.client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        // Return the raw JSON output (no formatting)
        return responseBody.content?.[0]?.text ?? responseBody;
    }
}
