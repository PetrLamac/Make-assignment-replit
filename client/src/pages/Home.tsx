import { useState } from 'react';
import TopNav from '@/components/TopNav';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ResultsPanel from '@/components/ResultsPanel';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResponse } from '@shared/schema';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
    setUploadedFile(file);
    setAnalysisResult(null);
    setShowResults(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setShowResults(false);
  };

  const handleRunFlow = async (file: File) => {
    console.log('Running flow for:', file.name);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowResults(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setAnalysisResult(result);
      setShowResults(true);

      if (result.status === 'ok') {
        toast({
          title: "Analysis complete",
          description: `Successfully analyzed: ${result.error_title}`,
        });
      } else {
        toast({
          title: "Analysis failed",
          description: result.reason || "Unable to analyze the image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
      
      setAnalysisResult({
        analysis_id: crypto.randomUUID(),
        status: 'failed',
        error_title: 'Upload Failed',
        error_code: null,
        product: null,
        environment: null,
        reason: error instanceof Error ? error.message : 'Unknown error',
        probable_cause: 'unknown',
        suggested_fix: 'Please check your connection and try again.',
        severity: 'low',
        confidence: 0,
        follow_up_questions: [],
      });
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <TopNav />
      <div className="flex-1 relative">
        <WorkflowCanvas
          onImageUpload={handleImageUpload}
          onRunFlow={handleRunFlow}
          onRemoveFile={handleRemoveFile}
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
        />
        {showResults && analysisResult && (
          <ResultsPanel
            result={analysisResult}
            onClose={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
}
