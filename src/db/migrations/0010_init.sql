ALTER TABLE "number_attributes" RENAME TO "number_values";--> statement-breakpoint
ALTER TABLE "text_attributes" RENAME TO "text_values";--> statement-breakpoint
ALTER TABLE "metric_attributes" RENAME TO "metric_unit_values";--> statement-breakpoint
ALTER TABLE "date_attributes" RENAME TO "date_values";--> statement-breakpoint
ALTER TABLE "number_values" DROP CONSTRAINT "number_attributes_asset_instance_id_item_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "number_values" DROP CONSTRAINT "number_attributes_attribute_id_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "text_values" DROP CONSTRAINT "text_attributes_asset_instance_id_item_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "text_values" DROP CONSTRAINT "text_attributes_attribute_id_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "metric_unit_values" DROP CONSTRAINT "metric_attributes_asset_instance_id_item_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "metric_unit_values" DROP CONSTRAINT "metric_attributes_attribute_id_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "date_values" DROP CONSTRAINT "date_attributes_asset_instance_id_item_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "date_values" DROP CONSTRAINT "date_attributes_attribute_id_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "number_values" ADD CONSTRAINT "number_values_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_values" ADD CONSTRAINT "number_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_values" ADD CONSTRAINT "text_values_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_values" ADD CONSTRAINT "text_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_unit_values" ADD CONSTRAINT "metric_unit_values_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_unit_values" ADD CONSTRAINT "metric_unit_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_values" ADD CONSTRAINT "date_values_asset_instance_id_item_instances_id_fk" FOREIGN KEY ("asset_instance_id") REFERENCES "public"."item_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_values" ADD CONSTRAINT "date_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE no action ON UPDATE no action;