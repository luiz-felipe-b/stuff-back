CREATE TYPE "public"."organization_tiers" AS ENUM('untiered', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."user_types" AS ENUM('admin', 'staff', 'root', 'invited');--> statement-breakpoint
CREATE TYPE "public"."metric_unit" AS ENUM('ton', 'kilogram', 'gram', 'kilometer', 'meter', 'centimeter', 'square_meter', 'cubic_meter', 'mile', 'feet', 'degree', 'liter');--> statement-breakpoint
CREATE TYPE "public"."time_metric_unit" AS ENUM('second', 'minute', 'hour', 'day', 'week', 'fortnight', 'month', 'year');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"tier" "organization_tiers" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"creation_date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"type" "user_types" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"authenticated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" text PRIMARY KEY NOT NULL,
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
CREATE TABLE "item_instances" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"author_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"author_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "number_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text,
	"value" real NOT NULL,
	"metric_unit" "metric_unit" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "date_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "switch_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selection_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selection_option_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"selection_id" text NOT NULL,
	"value" text NOT NULL,
	"selected" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_metric_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"attribute_id" text NOT NULL,
	"value" real NOT NULL,
	"metric_unit" time_metric_unit NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items_to_attributes" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"instance_id" text NOT NULL,
	"attribute_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_instances" ADD CONSTRAINT "item_instances_template_id_item_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."item_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_instances" ADD CONSTRAINT "item_instances_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_templates" ADD CONSTRAINT "item_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_templates" ADD CONSTRAINT "item_templates_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_attributes" ADD CONSTRAINT "number_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "text_attributes" ADD CONSTRAINT "text_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "metric_attributes" ADD CONSTRAINT "metric_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "date_attributes" ADD CONSTRAINT "date_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "switch_attributes" ADD CONSTRAINT "switch_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "file_attributes" ADD CONSTRAINT "file_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "selection_attributes" ADD CONSTRAINT "selection_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "selection_option_attributes" ADD CONSTRAINT "selection_option_attributes_selection_id_selection_attributes_id_fk" FOREIGN KEY ("selection_id") REFERENCES "public"."selection_attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "time_metric_attributes" ADD CONSTRAINT "time_metric_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "items_to_attributes" ADD CONSTRAINT "items_to_attributes_item_id_item_templates_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_to_attributes" ADD CONSTRAINT "items_to_attributes_instance_id_item_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_to_attributes" ADD CONSTRAINT "items_to_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;