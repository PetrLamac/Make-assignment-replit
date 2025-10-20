import { useState } from 'react';
import { X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface ResultsPanelProps {
  result: any;
  onClose: () => void;
}

export default function ResultsPanel({ result, onClose }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Analysis results copied as JSON",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[480px] h-[60vh] bg-white border-t md:border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right" data-testid="panel-results">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Analysis Results</h2>
            <p className="text-xs text-muted-foreground">ID: {result.analysis_id?.slice(0, 8) || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            data-testid="button-copy"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="ml-2">{copied ? 'Copied' : 'Copy JSON'}</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1" data-testid="text-error-title">
                {result.error_title || 'No title available'}
              </h3>
              {result.error_code && (
                <p className="text-xs font-mono text-muted-foreground" data-testid="text-error-code">
                  Code: {result.error_code}
                </p>
              )}
            </div>
            {result.severity && (
              <Badge className={getSeverityColor(result.severity)} data-testid="badge-severity">
                {result.severity}
              </Badge>
            )}
          </div>
        </Card>

        {result.probable_cause && (
          <Card className="p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Probable Cause
            </div>
            <p className="text-sm text-foreground" data-testid="text-probable-cause">
              {result.probable_cause.replace(/_/g, ' ')}
            </p>
          </Card>
        )}

        {result.suggested_fix && (
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="text-xs font-medium text-success uppercase tracking-wide mb-2">
              Suggested Fix
            </div>
            <p className="text-sm text-foreground" data-testid="text-suggested-fix">
              {result.suggested_fix}
            </p>
          </Card>
        )}

        {result.environment && (
          <Card className="p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Environment
            </div>
            <div className="grid grid-cols-2 gap-3">
              {result.environment.os && (
                <div>
                  <div className="text-xs text-muted-foreground">OS</div>
                  <div className="text-sm font-medium text-foreground">{result.environment.os}</div>
                </div>
              )}
              {result.environment.browser && (
                <div>
                  <div className="text-xs text-muted-foreground">Browser</div>
                  <div className="text-sm font-medium text-foreground">{result.environment.browser}</div>
                </div>
              )}
              {result.environment.app && (
                <div>
                  <div className="text-xs text-muted-foreground">Application</div>
                  <div className="text-sm font-medium text-foreground">{result.environment.app}</div>
                </div>
              )}
              {result.environment.version && (
                <div>
                  <div className="text-xs text-muted-foreground">Version</div>
                  <div className="text-sm font-medium text-foreground">{result.environment.version}</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {result.product && (
          <Card className="p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Product
            </div>
            <p className="text-sm text-foreground" data-testid="text-product">{result.product}</p>
          </Card>
        )}

        {result.follow_up_questions && result.follow_up_questions.length > 0 && (
          <Card className="p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Follow-up Questions
            </div>
            <ul className="space-y-2">
              {result.follow_up_questions.map((question: string, index: number) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {result.confidence !== undefined && (
          <Card className="p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Confidence Score
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
          </Card>
        )}

        <Separator />

        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawJSON(!showRawJSON)}
            className="w-full justify-between"
            data-testid="button-toggle-json"
          >
            <span className="text-xs font-medium">Raw JSON</span>
            {showRawJSON ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showRawJSON && (
            <Card className="mt-2 p-4 bg-slate-900 overflow-x-auto" data-testid="code-json">
              <pre className="text-xs font-mono text-green-400">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
