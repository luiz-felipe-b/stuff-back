ALTER TABLE "organizations" ALTER COLUMN "creation_date" SET DATA TYPE timestamp WITHOUT TIME ZONE USING creation_date::TIMESTAMP WITHOUT TIME ZONE;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "creation_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp WITHOUT TIME ZONE DEFAULT now() NOT NULL;
