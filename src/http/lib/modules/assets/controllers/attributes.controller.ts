import { FastifyRequest, FastifyReply } from "fastify";
import { Controller } from "../../../common/controllers/controller";
import { AttributesService } from "../services/attributes.service";
import { BadRequestError } from "../../../util/errors/bad-request.error";
import { createAttributeSchema } from "../schemas/attributes.schema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
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
            if (!request.user || !request.user.id) {
                throw new BadRequestError('User is required to create an attribute');
            }
            const bodyValidation = createAttributeSchema.omit({authorId: true}).safeParse(request.body);
            if (!bodyValidation.success) {
                throw new BadRequestError(bodyValidation.error.errors[0].message);
            }
            const result = await this.attributesService.createAttribute({
                ...bodyValidation.data,
                authorId: request.user.id,
            });
            return reply.code(201).send({
                data: result,
                message: 'Attribute created successfully',
            });
        });
    }

    async createAttributeValue(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(request, reply, async () => {
            if (!request.user || !request.user.id) {
                throw new BadRequestError('User is required to create an attribute value');
            }
            const paramsValidation = z.object({
                attributeId: z.string().uuid(),
            }).safeParse(request.params);
            if (!paramsValidation.success) throw new BadRequestError(paramsValidation.error.errors[0].message);
            const { attributeId } = paramsValidation.data;
            const bodyValidation = z.object({
                assetInstanceId: z.string().uuid(),
                value: z.any(),
                attributeType: z.enum(['number', 'text', 'boolean', 'date', 'metric', 'select']),
                metricUnit: z.string().optional(),
            }).safeParse(request.body);
            if (!bodyValidation.success) throw new BadRequestError(bodyValidation.error.errors[0].message);
            const valueData = {
                attributeId,
                ...bodyValidation.data
            };
            const result = await this.attributesService.createAttributeValue(valueData);
            if (!result) throw new InternalServerError("Failed to create attribute value");
            return reply.code(201).send({
                data: result,
                message: 'Attribute value created successfully',
            });
        });
    }
}