import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  errorTitle: text("error_title"),
  errorCode: text("error_code"),
  product: text("product"),
  environment: jsonb("environment").$type<{
    os?: string;
    browser?: string;
    app?: string;
    version?: string;
  }>(),
  probableCause: text("probable_cause"),
  suggestedFix: text("suggested_fix"),
  severity: text("severity"),
  confidence: real("confidence"),
  followUpQuestions: jsonb("follow_up_questions").$type<string[]>(),
  status: text("status").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

// Response schema matching PRD requirements
export const analysisResponseSchema = z.object({
  error_title: z.string(),
  error_code: z.string().nullable(),
  product: z.string().nullable(),
  environment: z.object({
    os: z.string().nullable().optional(),
    browser: z.string().nullable().optional(),
    app: z.string().nullable().optional(),
    version: z.string().nullable().optional(),
  }).nullable(),
  probable_cause: z.enum([
    'network_error',
    'authentication_error',
    'permission_denied',
    'timeout',
    'not_found',
    'rate_limit',
    'invalid_input',
    'server_error',
    'dependency_down',
    'unknown'
  ]),
  suggested_fix: z.string().max(500),
  severity: z.enum(['low', 'medium', 'high']),
  confidence: z.number().min(0).max(1),
  follow_up_questions: z.array(z.string()).max(3),
  analysis_id: z.string(),
  status: z.enum(['ok', 'failed']),
  reason: z.string().optional(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
