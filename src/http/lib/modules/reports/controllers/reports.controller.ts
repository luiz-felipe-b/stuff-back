import { FastifyRequest, FastifyReply } from "fastify";
import { ReportsService } from "../services/reports.service";
import { createReportSchema, updateReportSchema, reportIdSchema } from "../schemas/reports.schema";
import { generatePresignedUploadUrl } from "../../../util/s3-presign";
import { env } from "../../../../../env";

export class ReportsController {
  constructor(private service: ReportsService) {}

  /**
   * Gera uma presigned URL para upload de CSV no S3
   * Body esperado: { filename: string }
   */
  async getPresignedUrl(request: FastifyRequest, reply: FastifyReply) {
    const { filename } = request.body as { filename?: string };
    if (!filename) {
      return reply.code(400).send({ error: "filename é obrigatório" });
    }
    const bucket = "stuff-app"; // ajuste se necessário
    const s3Key = `reports/${Date.now()}_${filename}`;
    const url = await generatePresignedUploadUrl(bucket, s3Key);
    return reply.send({ url, key: s3Key });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createReportSchema.parse(request.body);
    if (!data.key || typeof data.key !== "string") {
      return reply.code(400).send({ error: "key é obrigatório" });
    }
    // const data = { ...rest, fileUrl };
    // const parsed = createReportSchema.parse();
    const report = await this.service.create(data);
    return reply.code(201).send(report);
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    const reports = await this.service.findAll();
    return reply.send(reports);
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = reportIdSchema.parse(request.params);
    const report = await this.service.findById(id);
    return reply.send(report);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = reportIdSchema.parse(request.params);
    const data = updateReportSchema.parse(request.body);
    const updated = await this.service.update(id, data);
    return reply.send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = reportIdSchema.parse(request.params);
    await this.service.delete(id);
    return reply.code(204).send();
  }
}
