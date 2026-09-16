CREATE TABLE "temporary_apis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" text NOT NULL,
	"manage_token_hash" text NOT NULL,
	"client_key" text NOT NULL,
	"name" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "temporary_apis_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE INDEX "temporary_apis_client_expires_idx" ON "temporary_apis" USING btree ("client_key","expires_at");--> statement-breakpoint
CREATE INDEX "temporary_apis_expires_at_idx" ON "temporary_apis" USING btree ("expires_at");