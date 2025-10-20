import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer, { type FileFilterCallback } from "multer";
import { storage } from "./storage";
import { analyzeErrorScreenshot } from "./services/imageAnalysis";

// Configure multer for image upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Only accept PNG and JPEG
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/v1/analyze-image - Analyze an error screenshot
  app.post("/api/v1/analyze-image", 
    (req, res, next) => {
      upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Multer-specific errors (file size, field count, etc.)
          return res.status(400).json({
            analysis_id: crypto.randomUUID(),
            status: "failed",
            reason: err.code === 'LIMIT_FILE_SIZE' 
              ? 'File size exceeds 15MB limit. Please upload a smaller image.'
              : `Upload error: ${err.message}`,
            error_title: "Upload Failed",
            error_code: null,
            product: null,
            environment: null,
            probable_cause: "invalid_input",
            suggested_fix: "Please ensure your image is under 15MB and try again.",
            severity: "low",
            confidence: 0,
            follow_up_questions: [],
          });
        } else if (err) {
          // File filter or other errors
          return res.status(400).json({
            analysis_id: crypto.randomUUID(),
            status: "failed",
            reason: err.message || 'Invalid file type. Only PNG and JPEG images are allowed.',
            error_title: "Invalid File Type",
            error_code: null,
            product: null,
            environment: null,
            probable_cause: "invalid_input",
            suggested_fix: "Please upload a PNG or JPEG image file.",
            severity: "low",
            confidence: 0,
            follow_up_questions: [],
          });
        }
        next();
      });
    },
    async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          analysis_id: crypto.randomUUID(),
          status: "failed",
          reason: "No file uploaded. Please upload a PNG or JPEG image.",
          error_title: "No File",
          error_code: null,
          product: null,
          environment: null,
          probable_cause: "invalid_input",
          suggested_fix: "Please select an image file to upload.",
          severity: "low",
          confidence: 0,
          follow_up_questions: [],
        });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');

      // Analyze the image using OpenAI Vision
      const analysisResult = await analyzeErrorScreenshot(base64Image);

      // Store the analysis result (without the image)
      await storage.createAnalysisResult({
        errorTitle: analysisResult.error_title,
        errorCode: analysisResult.error_code,
        product: analysisResult.product,
        environment: analysisResult.environment,
        probableCause: analysisResult.probable_cause,
        suggestedFix: analysisResult.suggested_fix,
        severity: analysisResult.severity,
        confidence: analysisResult.confidence,
        followUpQuestions: analysisResult.follow_up_questions,
        status: analysisResult.status,
        reason: analysisResult.reason,
      });

      // Return the analysis result
      res.json(analysisResult);
    } catch (error) {
      console.error("Error in /api/v1/analyze-image:", error);
      
      res.status(500).json({
        analysis_id: crypto.randomUUID(),
        status: "failed",
        reason: error instanceof Error ? error.message : "Internal server error",
        error_title: "Server Error",
        error_code: null,
        product: null,
        environment: null,
        probable_cause: "server_error",
        suggested_fix: "An error occurred while processing your request. Please try again.",
        severity: "medium",
        confidence: 0,
        follow_up_questions: [],
      });
    }
  });

  // GET /api/v1/analyses - Get all analysis results
  app.get("/api/v1/analyses", async (req, res) => {
    try {
      const results = await storage.getAllAnalysisResults();
      res.json(results);
    } catch (error) {
      console.error("Error in /api/v1/analyses:", error);
      res.status(500).json({ error: "Failed to fetch analysis results" });
    }
  });

  // GET /api/v1/analyses/:id - Get a specific analysis result
  app.get("/api/v1/analyses/:id", async (req, res) => {
    try {
      const result = await storage.getAnalysisResult(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Error in /api/v1/analyses/:id:", error);
      res.status(500).json({ error: "Failed to fetch analysis result" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
