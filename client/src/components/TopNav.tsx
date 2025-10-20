import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6" data-testid="header-top-nav">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">AI Image Analyzer</h1>
          <p className="text-xs text-muted-foreground">Error Screenshot Analysis</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" data-testid="button-help">
          Help
        </Button>
      </div>
    </header>
  );
}
