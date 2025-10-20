# Supabase Setup Instructions

Your application is now configured to use Supabase! The server log shows `[storage] Using Supabase storage`, which means it's ready to connect.

## Step 1: Create the Database Table

You need to run the SQL migration to create the `analysis_results` table in your Supabase database.

### How to run the migration:

1. **Go to your Supabase project dashboard** at https://supabase.com/dashboard
2. **Select your project**
3. **Go to the SQL Editor** (left sidebar)
4. **Click "New query"**
5. **Copy and paste this SQL:**

```sql
-- Create the analysis_results table
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

-- Disable Row Level Security (RLS) for this table
-- This allows the application to read/write freely using the anon key
ALTER TABLE "analysis_results" DISABLE ROW LEVEL SECURITY;
```

6. **Click "Run"** to execute the SQL

**Note:** We're disabling Row Level Security (RLS) because this is a backend service that needs full access to store analysis results. If you need to secure this data in the future, you can enable RLS and create appropriate policies.

## Step 2: Test the Integration

After creating the table:

1. Upload an error screenshot in your application
2. Click "Run Flow" to analyze it
3. The analysis results will now be **permanently stored** in Supabase!

## Verify Data Storage

To check that data is being saved:

1. Go to **Table Editor** in your Supabase dashboard
2. Select the **analysis_results** table
3. You should see your analysis records there

## What's Being Stored

According to the PRD, only the **extracted JSON/text metadata** is stored in Supabase:
- Error title, code, product
- Environment details (OS, browser, app, version)
- Probable cause and suggested fix
- Severity, confidence score
- Follow-up questions
- Analysis timestamp

**Important:** The actual image files are **NOT** stored, only the AI analysis results (as per PRD requirements).

## Future Enhancement: Image Storage

If you later want to also store the uploaded images in Supabase, you would:
1. Use Supabase Storage buckets to store image files
2. Add an `image_url` column to the `analysis_results` table
3. Update the upload handler to save images to Supabase Storage before analysis

This would be a simple modification to the existing codebase.
