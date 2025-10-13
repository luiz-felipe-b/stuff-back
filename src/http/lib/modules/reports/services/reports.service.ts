import { uploadSupabaseS3Object } from '../../../util/s3-connection';
import { ReportsRepository } from "../repositories/reports.repository";
import { CreateReport, UpdateReport } from "../schemas/reports.schema";
import { BadRequestError } from "../../../util/errors/bad-request.error";
import { NotFoundError } from "../../../util/errors/not-found.error";
import { env } from '../../../../../env';

export class ReportsService {
  constructor(private repo: ReportsRepository) {}

  async create(data: CreateReport) {
    if (!data.organizationId || !data.title) throw new BadRequestError("Dados obrigatórios ausentes");
// Monta a URL do arquivo S3
    const bucket = env.SUPABASE_BUCKET; // ajuste se necessário
    const region = env.SUPABASE_BUCKET_REGION; // ajuste se necessário
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${data.key}`;
    const newData = { ...data, fileUrl };
    return this.repo.create(newData);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const report = await this.repo.findById(id);
    if (!report) throw new NotFoundError("Relatório não encontrado");
    return report;
  }

  async update(id: string, data: UpdateReport) {
    const updated = await this.repo.update(id, data);
    if (!updated) throw new NotFoundError("Relatório não encontrado");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundError("Relatório não encontrado");
    return deleted;
  }
}
