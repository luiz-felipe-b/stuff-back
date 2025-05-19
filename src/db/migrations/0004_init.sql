ALTER TABLE "organizations" ALTER COLUMN "creation_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "update_date" SET DEFAULT now();