CREATE TABLE "albums" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "albums_user_id_idx" ON "albums" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "albums_title_idx" ON "albums" USING btree ("title");