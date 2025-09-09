import { FastifyRequest, FastifyReply } from "fastify";
import { Controller } from "../../../common/controllers/controller";
import { AttributesService } from "../services/attributes.service";
import { BadRequestError } from "../../../util/errors/bad-request.error";
import { createAttributeSchema } from "../schemas/attributes.schema";
import { z } from "zod";
import { InternalServerError } from "../../../util/errors/internal-server-error";

export class AttributesController extends Controller {

    constructor(public readonly attributesService: AttributesService) {
        super();
     }

    async getAllAttributes(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const result = await this.attributesService.getAllAttributes();
            return reply.code(200).send({
                data: result,
                message: 'Attributes found',
            });
        });
    }
    
    async getAttributeById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const paramsSchema = z.object({
                attributeId: z.string().uuid(),
            });
            const paramsValidation = paramsSchema.safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeId } = paramsValidation.data;
            const result = await this.attributesService.getAttributeById(attributeId);
            if (!result) throw new BadRequestError(`Attribute not found`);
            return reply.code(200).send({
                data: result,
                message: 'Attribute found',
            });
        });
    }

    async createAttribute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const user = request.user as { id: string };
            if (!user || !user.id) {
                throw new BadRequestError('User is required to create an attribute');
            }
            const bodyValidation = createAttributeSchema.omit({authorId: true}).safeParse(request.body);
            if (!bodyValidation.success) {
                throw new BadRequestError(bodyValidation.error.errors[0].message);
            }
            const result = await this.attributesService.createAttribute({
                ...bodyValidation.data,
                authorId: user.id,
            });
            return reply.code(201).send({
                data: result,
                message: 'Attribute created successfully',
            });
        });
    }

    async createAttributeValue(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const user = request.user as { id: string };
            if (!user || !user.id) {
                throw new BadRequestError('User is required to create an attribute value');
            }
            const paramsValidation = z.object({
                attributeId: z.string().uuid(),
            }).safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeId } = paramsValidation.data;
            console.log(attributeId)
            const bodyValidation = z.object({
                assetId: z.string().uuid(),
                value: z.string()
            }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const valueData = {
                attributeId,
                ...bodyValidation.data
            };
            console.log(valueData)
            const result = await this.attributesService.createAttributeValue(valueData);
            if (!result) throw new InternalServerError("Failed to create attribute value");
            return reply.code(201).send({
                data: result,
                message: 'Attribute value created successfully',
            });
        });
    }

    async updateAttribute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const paramsSchema = z.object({
                attributeId: z.string().uuid(),
            });
            const paramsValidation = paramsSchema.safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeId } = paramsValidation.data;
            const bodyValidation = createAttributeSchema.omit({ authorId: true }).partial().safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.attributesService.updateAttribute(attributeId, bodyValidation.data);
            if (!result) throw new InternalServerError("Failed to update attribute");
            return reply.code(200).send({
                data: result,
                message: 'Attribute updated successfully',
            });
        });
    }

    async deleteAttribute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const paramsSchema = z.object({
                attributeId: z.string().uuid(),
            });
            const paramsValidation = paramsSchema.safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeId } = paramsValidation.data;
            const result = await this.attributesService.deleteAttribute(attributeId);
            if (!result) throw new InternalServerError("Failed to delete attribute");
            return reply.code(200).send({
                data: result,
                message: 'Attribute deleted successfully',
            });
        });
    }

    async updateAttributeValue(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const paramsSchema = z.object({
                attributeValueId: z.string().uuid(),
            });
            const paramsValidation = paramsSchema.safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeValueId } = paramsValidation.data;
            const bodyValidation = z.object({
                value: z.any().optional(),
                metricUnit: z.string().optional(),
                timeUnit: z.string().optional(),
            }).partial().safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const result = await this.attributesService.updateAttributeValue(attributeValueId, bodyValidation.data);
            if (!result) throw new InternalServerError("Failed to update attribute value");
            return reply.code(200).send({
                data: result,
                message: 'Attribute value updated successfully',
            });
        });
    }

    async deleteAttributeValue(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            const paramsSchema = z.object({
                attributeValueId: z.string().uuid(),
            });
            const paramsValidation = paramsSchema.safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeValueId } = paramsValidation.data;
            const result = await this.attributesService.deleteAttributeValue(attributeValueId);
            if (!result) throw new InternalServerError("Failed to delete attribute value");
            return reply.code(200).send({
                data: result,
                message: 'Attribute value deleted successfully',
            });
        });
    }
}