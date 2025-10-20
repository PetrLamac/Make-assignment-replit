CREATE TABLE "analysis_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"error_title" text,
	"error_code" text,
	"product" text,
	"environment" jsonb,
	"probable_cause" text,
	"suggested_fix" text,
	"severity" text,
	"confidence" real,
	"follow_up_questions" jsonb,
	"status" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now()
);
