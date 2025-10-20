import { Handle, Position, NodeProps } from 'reactflow';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AIAnalysisNode({ data }: NodeProps) {
  const { isAnalyzing, result } = data;

  const getStatusBadge = () => {
    if (isAnalyzing) {
      return <Badge className="bg-processing text-processing-foreground">Processing</Badge>;
    }
    if (result?.status === 'ok') {
      return <Badge className="bg-success text-success-foreground">Complete</Badge>;
    }
    if (result?.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="secondary">Ready</Badge>;
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary border-2 border-white"
        data-testid="handle-target"
      />

      <Card className={`w-64 p-4 bg-white border-2 shadow-md hover-elevate ${
        isAnalyzing ? 'border-processing' : result?.status === 'ok' ? 'border-success' : ''
      }`} data-testid="node-ai-analysis">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isAnalyzing ? 'bg-processing/10' : 'bg-secondary/10'
          }`}>
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'text-processing animate-pulse' : 'text-secondary'}`} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">AI Analysis</div>
            <div className="text-xs text-muted-foreground">Vision Model</div>
          </div>
          {getStatusBadge()}
        </div>

        {isAnalyzing && (
          <div className="space-y-2" data-testid="status-analyzing">
            <Progress value={65} className="h-1" />
            <p className="text-xs text-muted-foreground">Analyzing image...</p>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-2" data-testid="status-complete">
            <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
              {result.status === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {result.error_title || 'Analysis complete'}
                </p>
                {result.severity && (
                  <p className="text-xs text-muted-foreground capitalize">{result.severity} severity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isAnalyzing && !result && (
          <div className="text-xs text-muted-foreground">
            Waiting for image...
          </div>
        )}
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary border-2 border-white"
        data-testid="handle-source"
      />
    </div>
  );
}
