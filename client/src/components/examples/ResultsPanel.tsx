import ResultsPanel from '../ResultsPanel';

export default function ResultsPanelExample() {
  const mockResult = {
    analysis_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    status: 'ok',
    error_title: '404 Not Found - Resource Missing',
    error_code: 'HTTP_404',
    product: 'E-commerce API',
    environment: {
      os: 'Ubuntu 22.04',
      browser: 'Firefox 121.0',
      app: 'API Gateway',
      version: '3.2.0',
    },
    probable_cause: 'not_found',
    suggested_fix: 'Verify the URL endpoint is correct. Check if the resource has been moved or deleted. Review API documentation for the correct endpoint path.',
    severity: 'low',
    confidence: 0.92,
    follow_up_questions: [
      'Was this endpoint working previously?',
      'Have there been any recent API version updates?',
      'Can you access other endpoints successfully?',
    ],
  };

  return (
    <div className="h-screen w-full bg-background">
      <ResultsPanel
        result={mockResult}
        onClose={() => console.log('Close panel')}
      />
    </div>
  );
}
