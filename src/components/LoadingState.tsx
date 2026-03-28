import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <p className="text-sm text-destructive">{message}</p>
    <Button onClick={onRetry} variant="outline" className="border-primary text-primary hover:bg-primary/10">
      <RefreshCw className="w-4 h-4 mr-2" /> Retry
    </Button>
  </div>
);
