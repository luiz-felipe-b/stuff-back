import { z } from "zod";
import { createReportSchema, updateReportSchema } from "../schemas/reports.schema.ts";

export const reportSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid().nullable(),
  organizationId: z.string().uuid(),
  title: z.string(),
  file_url: z.string().url().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reportRouteDocs = {
  create: {
    tags: ["reports"],
    summary: "Create a report",
    body: createReportSchema, // agora espera { key }
    response: {
      201: reportSchema,
    },
    description: "O cliente deve enviar apenas a chave S3 do arquivo (key), não a URL. O backend monta a URL final.",
  },
  findAll: {
    tags: ["reports"],
    summary: "List all reports",
    response: {
      200: z.array(reportSchema),
    },
  },
  findById: {
    tags: ["reports"],
    summary: "Get report by id",
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: reportSchema,
    },
  },
  update: {
    tags: ["reports"],
    summary: "Update a report",
    params: z.object({ id: z.string().uuid() }),
    body: updateReportSchema,
    response: {
      200: reportSchema,
    },
  },
  delete: {
    tags: ["reports"],
    summary: "Delete a report",
    params: z.object({ id: z.string().uuid() }),
    response: {
      204: z.null(),
    },
  },
  presignedUrl: {
    tags: ["reports"],
    summary: "Generate a presigned URL for uploading a report file to S3",
    body: z.object({
      filename: z.string().min(1).describe("Original filename of the report file"),
    }),
    response: {
      200: z.object({
        url: z.string().url().describe("Presigned URL for file upload"),
        key: z.string().describe("S3 object key where the file should be uploaded"),
      }),
      400: z.object({
        error: z.string().describe("Error message"),
      }),
    },
  },
};
