import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createAnalysisResult(insertResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const { data, error } = await this.supabase
      .from('analysis_results')
      .insert({
        error_title: insertResult.errorTitle,
        error_code: insertResult.errorCode,
        product: insertResult.product,
        environment: insertResult.environment,
        probable_cause: insertResult.probableCause,
        suggested_fix: insertResult.suggestedFix,
        severity: insertResult.severity,
        confidence: insertResult.confidence,
        follow_up_questions: insertResult.followUpQuestions,
        status: insertResult.status,
        reason: insertResult.reason,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create analysis result: ${error.message}`);
    }

    return {
      id: data.id,
      errorTitle: data.error_title,
      errorCode: data.error_code,
      product: data.product,
      environment: data.environment,
      probableCause: data.probable_cause,
      suggestedFix: data.suggested_fix,
      severity: data.severity,
      confidence: data.confidence,
      followUpQuestions: data.follow_up_questions,
      status: data.status,
      reason: data.reason,
      createdAt: new Date(data.created_at),
    };
  }

  async getAnalysisResult(id: string): Promise<AnalysisResult | undefined> {
    const { data, error } = await this.supabase
      .from('analysis_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      throw new Error(`Failed to get analysis result: ${error.message}`);
    }

    return {
      id: data.id,
      errorTitle: data.error_title,
      errorCode: data.error_code,
      product: data.product,
      environment: data.environment,
      probableCause: data.probable_cause,
      suggestedFix: data.suggested_fix,
      severity: data.severity,
      confidence: data.confidence,
      followUpQuestions: data.follow_up_questions,
      status: data.status,
      reason: data.reason,
      createdAt: new Date(data.created_at),
    };
  }

  async getAllAnalysisResults(): Promise<AnalysisResult[]> {
    const { data, error } = await this.supabase
      .from('analysis_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get all analysis results: ${error.message}`);
    }

    return data.map(row => ({
      id: row.id,
      errorTitle: row.error_title,
      errorCode: row.error_code,
      product: row.product,
      environment: row.environment,
      probableCause: row.probable_cause,
      suggestedFix: row.suggested_fix,
      severity: row.severity,
      confidence: row.confidence,
      followUpQuestions: row.follow_up_questions,
      status: row.status,
      reason: row.reason,
      createdAt: new Date(row.created_at),
    }));
  }
}
