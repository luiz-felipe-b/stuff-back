CREATE TYPE "public"."metric_unit" AS ENUM('ton', 'kilogram', 'gram', 'kilometer', 'meter', 'centimeter', 'square_meter', 'cubic_meter', 'mile', 'feet', 'degree', 'liter');--> statement-breakpoint
CREATE TABLE "assets_instances" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text,
	"organization_id" text,
	"creator_user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"creator_user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "number_values" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_values" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_unit_values" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL,
	"metric_unit" "metric_unit" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "date_values" (
	"id" text NOT NULL,
	"asset_instance_id" text NOT NULL,
	"attribute_id" text NOT NULL,
	"value" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets_instances" ADD CONSTRAINT "assets_instances_template_id_assets_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."assets_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_instances" ADD CONSTRAINT "assets_instances_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_instances" ADD CONSTRAINT "assets_instances_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_templates" ADD CONSTRAINT "assets_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_templates" ADD CONSTRAINT "assets_templates_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_asset_id_assets_templates_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_values" ADD CONSTRAINT "number_values_asset_instance_id_assets_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."assets_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_values" ADD CONSTRAINT "number_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_values" ADD CONSTRAINT "text_values_asset_instance_id_assets_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."assets_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_values" ADD CONSTRAINT "text_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_unit_values" ADD CONSTRAINT "metric_unit_values_asset_instance_id_assets_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."assets_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_unit_values" ADD CONSTRAINT "metric_unit_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_values" ADD CONSTRAINT "date_values_asset_instance_id_assets_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."assets_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_values" ADD CONSTRAINT "date_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;