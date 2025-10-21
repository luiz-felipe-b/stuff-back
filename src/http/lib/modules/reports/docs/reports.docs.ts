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

export const reportResponseSchema = z.object({
  message: z.string(),
  data: reportSchema.or(z.array(reportSchema)).or(z.null()),
});

export const reportListResponseSchema = z.object({
  message: z.string(),
  data: z.array(reportSchema),
});

export const reportRouteDocs = {
  create: {
    tags: ["reports"],
    summary: "Create a report",
    body: createReportSchema,
    response: {
      201: reportResponseSchema,
    },
    description: "O cliente deve enviar apenas a chave S3 do arquivo (key), não a URL. O backend monta a URL final.",
  },
  findAll: {
    tags: ["reports"],
    summary: "List all reports",
    response: {
      200: reportListResponseSchema,
    },
  },
  findById: {
    tags: ["reports"],
    summary: "Get report by id",
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: reportResponseSchema,
    },
  },
  update: {
    tags: ["reports"],
    summary: "Update a report",
    params: z.object({ id: z.string().uuid() }),
    body: updateReportSchema,
    response: {
      200: reportResponseSchema,
    },
  },
  delete: {
    tags: ["reports"],
    summary: "Delete a report",
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: z.object({ message: z.string(), data: z.null() }),
    },
  },
  presignedUrlUpload: {
    tags: ["reports"],
    summary: "Generate a presigned URL for uploading a report file to S3",
    body: z.object({
      filename: z.string().min(1).describe("Original filename of the report file"),
    }),
    response: {
      200: z.object({ message: z.string(), data: z.object({ url: z.string().url(), key: z.string() }) }),
      400: z.object({ message: z.string(), data: z.null() }),
    },
  },
  presignedUrlDownload: {
    tags: ["reports"],
    summary: "Generate a presigned URL for downloading a report file from S3",
    querystring: z.object({
      key: z.string().min(1).describe("S3 key of the report file"),
    }),
    response: {
      200: z.object({ message: z.string(), data: z.object({ url: z.string().url() }) }),
      400: z.object({ message: z.string(), data: z.null() }),
    },
  },
};
