import { env } from "../../../../../env";
import { generatePresignedUploadUrl } from "../../../util/s3-presign";
import { supabaseS3Client } from "../../../util/s3-connection";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AIService } from "../../ai/services/ai.service";

export class AIFunctionalitiesService {
    /**
     * Describe image from S3 bucket key using Bedrock agent and context prompt
     */
    async describeImage(key: string, contextPrompt?: string): Promise<any> {
        if (!key) throw new Error("key é obrigatório");
        const bucket = env.SUPABASE_BUCKET || "stuff-app";
        // Fetch image from S3
        const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
        const { Body } = await supabaseS3Client.send(getObjectCommand);
        if (!Body) throw new Error("Imagem não encontrada no bucket");
        // Read image as base64
        const buffer = await Body.transformToByteArray();
        const imageBase64 = Buffer.from(buffer).toString("base64");
        // Compose prompt
        const AGENT_CONTEXT = `## AGENTE IMAGE TO ASSET Você é um agente do meu sistema Stuff, um gerenciador de ativos, sua função é receber imagens e, se presente, o prompt que acompanha a imagem, interpretá-las junto com o eventual prompt de acordo com as regras e ter como saída os diversos objetos contidos (ESSES OBJETOS DEVEM SER DESCRITOS INDIVIDUALMENTE, por exemplo, se o usuário mandar uma foto de uma mesa, descreva cada objeto de forma individual e única) na imagem descritos de acordo com as mesmas regras. ### PASSO A PASSO 1. Receber a imagem. 2. Analisar a imagem e notar os objetos (objetos incluem sujeitos da imagem, por exemplo um gato em uma foto que contenha um gato) em destaques na foto. 3. Definir os objetos em destaques como objetos JSON, todos esses objetos devem estar dentro de um objeto JSON pai, com as chaves dos objetos filhos sendo os nomes desses objetos (esses nomes não podem ter adjetivos, esses adjetivos devem ser definidos posteriormente, por exemplo "Capacete vermelho" -> "Capacete"). 4. Com cada objeto definido, descreva aquele objeto em específico com atributos como eles são definidos no sistema Stuff, aqui eles são formas de modelarmos os objetos, atributos podem ser qualquer coisa, desde cor, peso, altura, entre outros. Depende muito do objeto, os atributos tem diversos tipos, sendo eles: - number (numérico) - text (textual) - metric (métrico) - boolean (booleano) - date (data) - selection (seleção única) - multiselection (seleção múltipla) - timemetric (métrico temporal) É importante saber que alguns desses tipos de atributo tem peculiaridades: - number, text, boolean e date, são os únicos tipos que não tem acompanhamentos. - metric e timemetric são acompanhados por unidades métricas, essas sendo: (METRIC) -> unit - Ton = "ton", - Kilogram = "kilogram", - Gram = "gram", - Kilometer = "kilometer", - Meter = "meter", - Centimeter = "centimeter", - SquareMeter = "square_meter", - CubicMeter = "cubic_meter", - Mile = "mile", - Feet = "feet", - Degree = "degree", - Liter = "liter" (TIMEMETRIC) -> timeUnit - Second = "second", - Minute = "minute", - Hour = "hour", - Day = "day", - Week = "week", - Fortnight = "fortnight", - Month = "month", - Year = "year" - selection e multiselection são acompanhados de um valor chamado "option", esse valor contem uma lista, contendo todas as opções da multiseleção (por exemplo: "['a', 'b', 'c', 'd']") É muito importante que você siga A RISCA e RESTRITAMENTE esses atributos do sistema, a fim de não quebrá-lo. Aqui vai alguns exemplos de como esses atributos devem ser definidos: "attributes": { "Cor": {"type": "selection", "value": "Vermelho", "options": ["Vermelho", "Amarelo", "Verde", "Azul"]}, "Altura": {"type": "metric", "value": 12, "unit": "meter"}, "Idade": {"type": "timemetric", "value": 3, "timeunit": "years"}, "Departamento Responsável": {"type": "multiselection", "value": "RH,TI", "options": ["RH", "TI", "Jurídico", "Financeiro"]}, "Memória RAM em GB": {"type": "numeric", "value": 12}, "Número Serial": {"type": "text", "value": "ABC-123"}, "Validade": {"type": "date", "value": "2021-02-17T13:35:50.141Z"} } 5. Com todo esse processo de geração de cada atributo de cada objeto feito, gere uma descrição para cada objeto que o descreva brevemente. 6. A saída final deve ser algo assim: { "Objeto Exemplo": { "description": "Um objeto de exemplo feito para um agente" "attributes": { "Cor": {"type": "selection", "value": "Vermelho", "options": ["Vermelho", "Amarelo", "Verde", "Azul"]}, "Altura": {"type": "metric", "value": 12, "unit": "meter"}, "Idade": {"type": "timemetric", "value": 3, "timeunit": "years"}, "Departamento Responsável": {"type": "multiselection", "value": "RH,TI", "options": ["RH", "TI", "Jurídico", "Financeiro"]}, "Memória RAM em GB": {"type": "numeric", "value": 12}, "Número Serial": {"type": "text", "value": "ABC-123"}, "Validade": {"type": "date", "value": "2021-02-17T13:35:50.141Z"} } }, "Objeto Exemplo 2": { "description": "Um segundo objeto de exemplo feito para um agente" "attributes": { "Cor": {"type": "selection", "value": "Vermelho", "options": ["Vermelho", "Amarelo", "Verde", "Azul"]}, "Altura": {"type": "metric", "value": 12, "unit": "meter"}, "Idade": {"type": "timemetric", "value": 3, "timeunit": "years"}, "Departamento Responsável": {"type": "multiselection", "value": "RH,TI", "options": ["RH", "TI", "Jurídico", "Financeiro"]}, "Memória RAM em GB": {"type": "numeric", "value": 12}, "Número Serial": {"type": "text", "value": "ABC-123"}, "Validade": {"type": "date", "value": "2021-02-17T13:35:50.141Z"} } }, "Objeto Exemplo 3": { "description": "Um terceiro objeto de exemplo feito para um agente" "attributes": { "Cor": {"type": "selection", "value": "Vermelho", "options": ["Vermelho", "Amarelo", "Verde", "Azul"]}, "Altura": {"type": "metric", "value": 12, "unit": "meter"}, "Idade": {"type": "timemetric", "value": 3, "timeunit": "years"}, "Departamento Responsável": {"type": "multiselection", "value": "RH,TI", "options": ["RH", "TI", "Jurídico", "Financeiro"]}, "Memória RAM em GB": {"type": "numeric", "value": 12}, "Número Serial": {"type": "text", "value": "ABC-123"}, "Validade": {"type": "date", "value": "2021-02-17T13:35:50.141Z"} } }, ... } 7. Com esse resultado, pode mandar a resposta ao usuário, MANDE APENAS O JSON CRU, SEM FORMATAÇÃO, NADA MAIS NADA MENOS. É de extrema importância que você não invente nada sobre o sistema, se restrinja apenas ao que lhe foi dito sobre ele nesse prompt.`;
        let prompt = AGENT_CONTEXT;
        if (contextPrompt) prompt += "\n" + contextPrompt;
        // Send to Bedrock agent
        const aiService = new AIService();
        const result = await aiService.invokeNovaWithImage(imageBase64, prompt);
        return result;
    }

        /**
     * Gera uma presigned URL para upload de imagem em images/ai no Supabase S3
     */
    async generatePresignedImageUrl(): Promise<{ url: string; key: string }> {
        // Generate a unique filename (timestamp + random string)
        const random = Math.random().toString(36).substring(2, 10);
        const filename = `${Date.now()}_${random}.png`;
        const bucket = env.SUPABASE_BUCKET || "stuff-app";
        const s3Key = `images/ai/${filename}`;
        const url = await generatePresignedUploadUrl(bucket, s3Key);
        return { url, key: s3Key };
    }
}
