CREATE TYPE "public"."metric_unit" AS ENUM('ton', 'kilogram', 'gram', 'kilometer', 'meter', 'centimeter', 'square_meter', 'cubic_meter', 'mile', 'feet', 'degree', 'liter');--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"author_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "number_attributes" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_attributes" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_attributes" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL,
	"metric_unit" "metric_unit" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "date_attributes" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_instances" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_asset_id_item_templates_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."item_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_attributes" ADD CONSTRAINT "number_attributes_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_attributes" ADD CONSTRAINT "number_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_attributes" ADD CONSTRAINT "text_attributes_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_attributes" ADD CONSTRAINT "text_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_attributes" ADD CONSTRAINT "metric_attributes_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_attributes" ADD CONSTRAINT "metric_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_attributes" ADD CONSTRAINT "date_attributes_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_attributes" ADD CONSTRAINT "date_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;