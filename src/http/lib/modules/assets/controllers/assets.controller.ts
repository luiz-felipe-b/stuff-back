import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../../common/controllers/controller";
import { AssetsService } from "../services/assets.service";
import { BadRequestError } from "../../../util/errors/bad-request.error";
import { createAssetTemplateSchema } from "../schemas/assets-templates.schema";
import { AssetInstance, createAssetInstanceSchema } from "../schemas/assets-instances.schema";
import { z } from "zod";

export class AssetsController extends Controller {
    private assetsService: AssetsService;

    constructor(assetsService: AssetsService) {
        super();
        this.assetsService = assetsService;
    }

    async getAllAssets(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const result = await this.assetsService.getAllAssets();
            console.log('Assets found:', result);
            return reply.code(200).send({
                data: result,
                message: 'Assets found',
            });
        });
    }

    async getAssetById(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const paramsValidation = z.object({
                id: z.string({ message: 'Asset ID is required' }).min(1, { message: 'Asset ID is required' }),
            });
            const validatedParams = paramsValidation.safeParse(request.params);
            if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
            const { id: assetId } = validatedParams.data;
            if (!assetId) throw new BadRequestError('Asset ID is required');
            const result = await this.assetsService.getAssetWithAttributes(assetId);
            console.log('Asset found:', result);
            if (!result) throw new BadRequestError('Asset not found');
            return reply.code(200).send({
                data: result,
                message: 'Asset found',
            });
        });
    }

    async createAssetTemplate(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            if (!request.user || !request.user.id) throw new BadRequestError('User is required to create an organization');
            const bodyValidation = createAssetTemplateSchema.omit({
                creatorUserId: true,
            }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.assetsService.createAssetTemplate({
                ...bodyValidation.data,
                creatorUserId: request.user.id,
            });
            return reply.code(201).send({
                data: result,
                message: 'Asset template created successfully',
            });
        }
        );
    }

    async createAssetInstance(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            if (!request.user || !request.user.id) throw new BadRequestError('User is required to create an asset instance');
            const bodyValidation = createAssetInstanceSchema.omit({
                creatorUserId: true,
            }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.assetsService.createAssetInstance({
                ...bodyValidation.data,
                creatorUserId: request.user.id,
            });
            return reply.code(201).send({
                data: result as AssetInstance,
                message: 'Asset instance created successfully',
            });
        });
    }
}