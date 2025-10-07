import { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../../../common/controllers/controller";
import { AssetsService } from "../services/assets.service";
import { BadRequestError } from "../../../util/errors/bad-request.error";
import { Asset, createAssetSchema, updateAssetSchema } from "../schemas/assets.schema";
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
            console.log(result)
            return reply.code(200).send({
                data: result,
                message: 'Assets found',
            });
        });
    }

    async getAllAssetsWithAttributes(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const result = await this.assetsService.getAllAssetsWithAttributes();
            return reply.code(200).send({
                data: result,
                message: 'Assets with attributes found',
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
            // console.log(result);
            if (!result) throw new BadRequestError('Asset not found');
            return reply.code(200).send({
                data: result,
                message: 'Asset found',
            });
        });
    }

    async createAsset(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            if (!request.user || !request.user.id) throw new BadRequestError('User is required to create an asset instance');
            const bodyValidation = createAssetSchema.omit({
                creatorUserId: true,
            }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.assetsService.createAsset({
                ...bodyValidation.data,
                creatorUserId: request.user.id,
            });
            return reply.code(201).send({
                data: result as Asset,
                message: 'Asset instance created successfully',
            });
        });
    }

    async editAsset(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const paramsValidation = z.object({
                id: z.string().uuid({ message: 'Asset ID must be a valid UUID' })
            });
            const validatedParams = paramsValidation.safeParse(request.params);
            if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
            const { id: assetId } = validatedParams.data;
            if (!assetId) throw new BadRequestError('Asset ID is required');
            const bodyValidation = updateAssetSchema.safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.assetsService.editAsset(assetId, bodyValidation.data);
            return reply.code(200).send({
                data: result,
                message: 'Asset updated',
            });
        });
    }
    async deleteAsset(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const paramsValidation = z.object({
                id: z.string().uuid({ message: 'Asset ID must be a valid UUID' })
            });
            const validatedParams = paramsValidation.safeParse(request.params);
            if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
            const { id: assetId } = validatedParams.data;
            if (!assetId) throw new BadRequestError('Asset ID is required');
            await this.assetsService.deleteAsset(assetId);
            return reply.code(200).send({
                data: { id: assetId },
                message: 'Asset deleted',
            });
        });
    }
    // Set the trashBin field for an asset
    async setAssetTrashBin(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(request, reply, async () => {
            const paramsValidation = z.object({
                id: z.string().uuid({ message: 'Asset ID must be a valid UUID' })
            });
            const validatedParams = paramsValidation.safeParse(request.params);
            if (!validatedParams.success) throw new BadRequestError(validatedParams.error.errors[0].message);
            const { id: assetId } = validatedParams.data;
            const bodyValidation = z.object({ trashBin: z.boolean() }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const { trashBin } = bodyValidation.data;
            const result = await this.assetsService.setAssetTrashBin(assetId, trashBin);
            return reply.code(200).send({
                data: result,
                message: `Asset trashBin set to ${trashBin}`,
            });
        });
    }
}