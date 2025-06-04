CREATE TABLE "item_instances" (
	"id" text NOT NULL,
	"template_id" text NOT NULL,
	"creator_user_id" text NOT NULL,
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
	"creator_user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"trash_bin" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_instances" ADD CONSTRAINT "item_instances_template_id_item_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."item_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_instances" ADD CONSTRAINT "item_instances_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_templates" ADD CONSTRAINT "item_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_templates" ADD CONSTRAINT "item_templates_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;