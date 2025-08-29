CREATE TYPE "public"."asset_type" AS ENUM('unique', 'replicable');--> statement-breakpoint
CREATE TYPE "public"."attribute_type" AS ENUM('text', 'number', 'boolean', 'date', 'metric', 'select', 'multiselection', 'timemetric', 'file', 'rfid');--> statement-breakpoint
ALTER TABLE assets ALTER COLUMN type TYPE asset_type USING type::asset_type;--> statement-breakpoint
ALTER TABLE "attributes" ALTER COLUMN "type" SET DATA TYPE attribute_type USING type::attribute_type;