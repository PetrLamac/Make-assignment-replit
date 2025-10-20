import { useState } from 'react';
import WorkflowCanvas from '../WorkflowCanvas';

export default function WorkflowCanvasExample() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        analysis_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        status: 'ok',
        error_title: 'Network Connection Timeout',
        error_code: 'ERR_CONNECTION_TIMEOUT',
        product: 'Customer Portal',
        environment: {
          os: 'Windows 11',
          browser: 'Chrome 120.0',
          app: 'WebApp',
          version: '2.5.1',
        },
        probable_cause: 'network_error',
        suggested_fix: 'Check your internet connection and firewall settings. Try disabling VPN if enabled. Contact your network administrator if the issue persists.',
        severity: 'medium',
        confidence: 0.87,
        follow_up_questions: [
          'Is this error occurring on all networks or just specific ones?',
          'Have you recently changed any firewall or proxy settings?',
        ],
      });
    }, 2000);
  };

  return (
    <div className="h-screen w-full">
      <WorkflowCanvas
        onImageUpload={handleImageUpload}
        analysisResult={result}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}
