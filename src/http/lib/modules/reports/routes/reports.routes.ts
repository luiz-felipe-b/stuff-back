import { FastifyInstance } from "fastify";
import { ReportsRepository } from "../repositories/reports.repository";
import { ReportsService } from "../services/reports.service";
import { ReportsController } from "../controllers/reports.controller";
import { reportRouteDocs } from "../docs/reports.docs";

export async function reportsRoutes(app: FastifyInstance) {
  const repo = new ReportsRepository();
  const service = new ReportsService(repo);
  const controller = new ReportsController(service);

  app.post("/", {onRequest: [app.authenticate], schema: reportRouteDocs.create}, controller.create.bind(controller));
  app.get("/", {onRequest: [app.authenticate], schema: reportRouteDocs.findAll}, controller.findAll.bind(controller));
  app.get("/:id", {onRequest: [app.authenticate], schema: reportRouteDocs.findById}, controller.findById.bind(controller));
  app.patch("/:id", {onRequest: [app.authenticate], schema: reportRouteDocs.update}, controller.update.bind(controller));
  app.delete("/:id", {onRequest: [app.authenticate], schema: reportRouteDocs.delete}, controller.delete.bind(controller));
  app.post("/upload", { onRequest: [app.authenticate], schema: reportRouteDocs.presignedUrlUpload }, controller.getUploadUrl.bind(controller));
  app.get("/download", { onRequest: [app.authenticate], schema: reportRouteDocs.presignedUrlDownload }, controller.getDownloadUrl.bind(controller));
}
