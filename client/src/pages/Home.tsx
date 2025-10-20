import { useState } from 'react';
import TopNav from '@/components/TopNav';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ResultsPanel from '@/components/ResultsPanel';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowResults(false);

    setTimeout(() => {
      const mockResult = {
        analysis_id: crypto.randomUUID(),
        status: 'ok',
        error_title: 'Authentication Failed - Invalid Credentials',
        error_code: 'AUTH_401',
        product: 'Customer Dashboard',
        environment: {
          os: 'macOS Sonoma',
          browser: 'Safari 17.2',
          app: 'Web Portal',
          version: '4.1.0',
        },
        probable_cause: 'authentication_error',
        suggested_fix: 'Double-check your username and password. Ensure Caps Lock is off. If you\'ve forgotten your password, use the "Forgot Password" link to reset it. Contact support if the issue persists after resetting.',
        severity: 'high',
        confidence: 0.94,
        follow_up_questions: [
          'Have you recently changed your password?',
          'Are you able to log in on other devices?',
          'Is two-factor authentication enabled on your account?',
        ],
      };

      setIsAnalyzing(false);
      setAnalysisResult(mockResult);
      setShowResults(true);
    }, 2500);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <TopNav />
      <div className="flex-1 relative">
        <WorkflowCanvas
          onImageUpload={handleImageUpload}
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
