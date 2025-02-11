import { z } from "zod";
import { Organization } from "../models/organization-model";
import { OrganizationsRepository } from "../repositories/organizations-repository";
import { FastifyRequest } from "fastify";
import { HttpError } from "../../../util/errors/http-error";
import { organizationErrors } from "../definitions/errors/organization-errors";
import { OrganizationTiers } from "../definitions/enums/organization-tiers-enum";

export class OrganizationsService {
    constructor(private organizationsRepository: OrganizationsRepository) {}

    /**
     * Obtém uma organização pelo ID
     * @param req - Requisição a ser validada
     * @returns Promise<Organization | null >
     **/
    async getOrganizationById(req: FastifyRequest): Promise<Organization | null> {
        const requestSchema = z.object({
            id: z.string(),
        });

        const validated = requestSchema.safeParse(req.params);
        if (!validated.success) {
            throw organizationErrors.MISSING_OR_INVALID_ID;
        }

        return this.organizationsRepository.findById(validated.data.id);
    }

    /**
     * Obtém uma organização pelo código
     * @param req - Requisição a ser validada
     * @returns Promise<Organization | null>
     **/
    async getOrganizationByCode(req: FastifyRequest): Promise<Organization | null> {
        const requestSchema = z.object({
            code: z.string(),
        });

        const validated = requestSchema.safeParse(req.params);
        if (!validated.success) {
            throw organizationErrors.MISSING_OR_INVALID_CODE;
        }

        return this.organizationsRepository.findByCode(validated.data.code);
    }

    /**
     * Obtém todas as organizações
     * @returns Promise<Organization[]>
     **/
    async getAllOrganizations(): Promise<Organization[]> {
        return this.organizationsRepository.findAll();
    }

    /**
     * Cria uma nova organização
     * @param req - Requisição a ser validada
     * @returns Promise<Organization>
     **/
    async createOrganization(req: FastifyRequest): Promise<Organization> {
        const requestSchema = z.object({
            authorId: z.string(),
            organizationCode: z.string(),
            name: z.string(),
            tier: z.nativeEnum(OrganizationTiers),
            active: z.boolean(),
        });

        const validated = requestSchema.safeParse(req.body);
        if (!validated.success) {
            const issue = validated.error.issues[0];
            throw new HttpError(`The following data is invalid or missing: ${issue.path[0]} | ${issue.message}`, 400);
        }

        const organizationExists = await this.organizationsRepository.findByCode(validated.data.organizationCode);
        if (organizationExists) {
            throw organizationErrors.ORGANIZATION_ALREADY_EXISTS;
        }

        return this.organizationsRepository.create(validated.data);
    }

    /**
     * Atualiza uma organização
     * @param req - Requisição a ser validada
     * @returns Promise<Organization>
     **/
    async updateOrganization(req: FastifyRequest): Promise<Organization> {
        // Validação do parâmetro
        const paramSchema = z.object({
            id: z.string(),
        });
        // Validação do corpo da requisição
        const validatedParam = paramSchema.safeParse(req.params);
        if (!validatedParam.success) {
            throw organizationErrors.MISSING_OR_INVALID_ID;
        }

        const bodySchema = z.object({
            authorId: z.string().optional(),
            organizationCode: z.string().optional(),
            name: z.string().optional(),
            tier: z.nativeEnum(OrganizationTiers).optional(),
            active: z.boolean().optional(),
        });

        const validatedBody = bodySchema.safeParse(req.body);
        if (!validatedBody.success) {
            const issue = validatedBody.error.issues[0];
            throw new HttpError(`The following data is invalid or missing: ${issue.path[0]} | ${issue.message}`, 400);
        }

        // Atualiza os dados da organização filtrando os dados que não foram enviados
        const updatedData = {
            id: validatedParam.data.id,
            ...Object.entries(validatedBody.data).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Partial<Organization>),
            updatedAt: new Date(),
        };

        return this.organizationsRepository.update(updatedData);
    }

    /**
     * Deleta uma organização
     * @param req - Requisição a ser validada
     * @returns Promise<Organization>
     **/
    async deleteOrganization(req: FastifyRequest): Promise<Organization> {
        const requestSchema = z.object({
            id: z.string(),
        });

        const validated = requestSchema.safeParse(req.params);
        if (!validated.success) {
            throw organizationErrors.MISSING_OR_INVALID_ID;
        }

        return this.organizationsRepository.delete(validated.data.id);
    }
}
