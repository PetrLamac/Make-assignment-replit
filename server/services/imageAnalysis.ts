import OpenAI from "openai";
import { analysisResponseSchema, type AnalysisResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeErrorScreenshot(base64Image: string): Promise<AnalysisResponse> {
  try {
    const systemPrompt = `You are an expert AI system for analyzing error screenshots from software applications. 
Your task is to extract structured information from error screenshots to help customer support agents triage issues.

Analyze the error screenshot and provide a detailed JSON response with the following structure:
{
  "error_title": "short human-readable title of the error",
  "error_code": "error code if visible, otherwise null",
  "product": "name of the product/application if identifiable, otherwise null",
  "environment": {
    "os": "operating system if visible",
    "browser": "browser if applicable",
    "app": "application name if visible",
    "version": "version number if visible"
  },
  "probable_cause": "one of: network_error, authentication_error, permission_denied, timeout, not_found, rate_limit, invalid_input, server_error, dependency_down, unknown",
  "suggested_fix": "concise fix suggestion (max 500 chars)",
  "severity": "one of: low, medium, high",
  "confidence": "confidence score between 0 and 1",
  "follow_up_questions": ["array of 0-3 relevant follow-up questions for the user"]
}

Important:
- Focus on extracting visible error messages, codes, and UI elements
- Make educated inferences about the environment from visual cues
- Provide actionable suggested fixes based on the error type
- Keep suggested_fix under 500 characters
- Set confidence based on how clear the error information is`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this error screenshot and extract all relevant error information. Provide your response in the exact JSON format specified.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsedResult = JSON.parse(content);

    // Generate analysis ID
    const analysisId = crypto.randomUUID();

    // Construct and validate the response
    const candidateResponse = {
      analysis_id: analysisId,
      error_title: parsedResult.error_title || "Unknown Error",
      error_code: parsedResult.error_code || null,
      product: parsedResult.product || null,
      environment: parsedResult.environment || null,
      probable_cause: parsedResult.probable_cause || "unknown",
      suggested_fix: (parsedResult.suggested_fix || "No fix suggestion available").slice(0, 500),
      severity: parsedResult.severity || "medium",
      confidence: Math.min(1, Math.max(0, parsedResult.confidence || 0.5)),
      follow_up_questions: Array.isArray(parsedResult.follow_up_questions) 
        ? parsedResult.follow_up_questions.slice(0, 3)
        : [],
      status: "ok" as const,
    };

    // Validate against schema
    const validationResult = analysisResponseSchema.safeParse(candidateResponse);
    
    if (!validationResult.success) {
      console.error("OpenAI response validation failed:", validationResult.error);
      throw new Error("Invalid response format from AI model");
    }

    return validationResult.data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    
    return {
      analysis_id: crypto.randomUUID(),
      error_title: "Analysis Failed",
      error_code: null,
      product: null,
      environment: null,
      probable_cause: "unknown",
      suggested_fix: "Unable to analyze the image. Please ensure it's a clear screenshot of an error message.",
      severity: "low",
      confidence: 0,
      follow_up_questions: [],
      status: "failed",
      reason: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
