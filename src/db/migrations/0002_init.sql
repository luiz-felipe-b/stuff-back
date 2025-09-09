ALTER TABLE "attribute_values" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attribute_values" DROP COLUMN "metric_unit";--> statement-breakpoint
ALTER TABLE "attribute_values" DROP COLUMN "time_unit";