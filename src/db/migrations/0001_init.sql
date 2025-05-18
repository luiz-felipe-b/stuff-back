CREATE TABLE "users_organizations" (
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "users_organizations_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_organization_id_users_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;