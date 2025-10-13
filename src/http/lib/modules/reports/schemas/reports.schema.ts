import { z } from "zod";

export const createReportSchema = z.object({
  authorId: z.string().uuid().optional().describe("Author ID (UUID)"),
  organizationId: z.string().uuid().describe("Organization ID (UUID)"),
  title: z.string().min(1).describe("Report title"),
  key: z.string().min(1).describe("Chave do arquivo CSV no S3 (ex: reports/123_nome.csv)")
});

export const insertReportDatabaseSchema = createReportSchema.extend({
  fileUrl: z.string().url().describe("URL do arquivo CSV já enviado para o S3")
}).omit({ key: true });

export const updateReportSchema = z.object({
  title: z.string().min(1).optional(),
  fileUrl: z.string().url().optional(),
});

export const reportIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateReport = z.infer<typeof createReportSchema>;
export type InsertReportDatabase = z.infer<typeof insertReportDatabaseSchema>;
export type UpdateReport = z.infer<typeof updateReportSchema>;
export type ReportId = z.infer<typeof reportIdSchema>;
