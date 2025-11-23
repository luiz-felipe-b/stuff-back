import { db } from "../../../../../db/connection";
import { reports } from "../../../../../db/schemas/reports.schema";
import { eq } from "drizzle-orm";
import { InsertReportDatabase, UpdateReport } from "../schemas/reports.schema";
// S3 deletion logic moved to service layer

export class ReportsRepository {
  async create(data: InsertReportDatabase) {
    const now = new Date();
    const [created] = await db.insert(reports).values({
      ...data,
      file_url: data.fileUrl,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return {
      ...created,
      createdAt: created.createdAt instanceof Date ? created.createdAt.toISOString() : created.createdAt,
      updatedAt: created.updatedAt instanceof Date ? created.updatedAt.toISOString() : created.updatedAt,
    };
  }

  async findAll() {
    const results = await db.select().from(reports);
    return results.map(report => ({
      ...report,
      createdAt: report.createdAt instanceof Date ? report.createdAt.toISOString() : report.createdAt,
      updatedAt: report.updatedAt instanceof Date ? report.updatedAt.toISOString() : report.updatedAt,
    }));
  }

  async findById(id: string) {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    if (!report) return report;
    return {
      ...report,
      createdAt: report.createdAt instanceof Date ? report.createdAt.toISOString() : report.createdAt,
      updatedAt: report.updatedAt instanceof Date ? report.updatedAt.toISOString() : report.updatedAt,
    };
  }

  async update(id: string, data: UpdateReport) {
    const now = new Date();
    const [updated] = await db.update(reports)
      .set({
        ...data,
        file_url: data.fileUrl,
        updatedAt: now,
      })
      .where(eq(reports.id, id))
      .returning();
    return {
      ...updated,
      createdAt: updated.createdAt instanceof Date ? updated.createdAt.toISOString() : updated.createdAt,
      updatedAt: updated.updatedAt instanceof Date ? updated.updatedAt.toISOString() : updated.updatedAt,
    };
  }

  async delete(id: string) {
    const [deleted] = await db.delete(reports).where(eq(reports.id, id)).returning();
    return deleted;
  }
}
