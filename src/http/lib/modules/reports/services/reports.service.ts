import { uploadSupabaseS3Object, deleteSupabaseS3Object } from '../../../util/s3-connection';
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
    // Find the report first to get the file_url
    const report = await this.repo.findById(id);
    if (!report) throw new NotFoundError("Relatório não encontrado");
    // Delete the S3 object if file_url is present
    if (report.file_url) {
      try {
        const urlParts = report.file_url.split("/");
        const bucketIndex = urlParts.findIndex(p => p === "public") + 1;
        const bucket = urlParts[bucketIndex];
        const key = urlParts.slice(bucketIndex + 1).join("/");
        if (bucket && key) {
          await deleteSupabaseS3Object(bucket, key);
        }
      } catch (err) {
        // Log error but continue with DB deletion
        console.error("Failed to delete S3 object:", err);
      }
    }
    const deleted = await this.repo.delete(id);
    return deleted;
  }
}
