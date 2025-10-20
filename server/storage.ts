import { type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(id: string): Promise<AnalysisResult | undefined>;
  getAllAnalysisResults(): Promise<AnalysisResult[]>;
}

export class MemStorage implements IStorage {
  private analysisResults: Map<string, AnalysisResult>;

  constructor() {
    this.analysisResults = new Map();
  }

  async createAnalysisResult(insertResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = randomUUID();
    const result: AnalysisResult = {
      id,
      errorTitle: insertResult.errorTitle ?? null,
      errorCode: insertResult.errorCode ?? null,
      product: insertResult.product ?? null,
      environment: insertResult.environment as any ?? null,
      probableCause: insertResult.probableCause ?? null,
      suggestedFix: insertResult.suggestedFix ?? null,
      severity: insertResult.severity ?? null,
      confidence: insertResult.confidence ?? null,
      followUpQuestions: insertResult.followUpQuestions as any ?? null,
      status: insertResult.status,
      reason: insertResult.reason ?? null,
      createdAt: new Date(),
    };
    this.analysisResults.set(id, result);
    return result;
  }

  async getAnalysisResult(id: string): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(id);
  }

  async getAllAnalysisResults(): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
