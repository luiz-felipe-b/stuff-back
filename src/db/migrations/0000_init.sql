CREATE TYPE "public"."user_types" AS ENUM('admin', 'moderator', 'user');--> statement-breakpoint
CREATE TYPE "public"."user_tiers" AS ENUM('free', 'plus', 'pro', 'enterprise');--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"password" text,
	"description" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"creation_date" timestamp NOT NULL,
	"update_date" timestamp NOT NULL,
	"logo" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"user_name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_types" DEFAULT 'user' NOT NULL,
	"tier" "user_tiers" DEFAULT 'free' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"authenticated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
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
CREATE TABLE "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;