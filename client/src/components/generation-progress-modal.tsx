/**
 * Generation Progress Modal
 *
 * Displays real-time progress for AI content generation (posts and scripts)
 * Shows progress bar, status message, and handles completion/errors
 */

import { useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Sparkles, X } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface GenerationProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'script';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: string;
  onComplete?: () => void;
}

export function GenerationProgressModal({
  isOpen,
  onClose,
  type,
  status,
  progress,
  message,
  error,
  onComplete,
}: GenerationProgressModalProps) {
  // Auto-close on completion after 2 seconds
  useEffect(() => {
    if (status === 'completed' && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete, onClose]);

  // Determine if modal can be closed
  const canClose = status === 'completed' || status === 'failed';

  // Handle close attempt
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if generation is complete or failed
    if (!open && canClose) {
      onClose();
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
      case 'processing':
        return <Loader2 className="h-12 w-12 animate-spin text-[#CEA54F]" />;
      case 'completed':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'queued':
        return `Generating ${type === 'post' ? 'Post' : 'Script'}...`;
      case 'processing':
        return `Creating Your ${type === 'post' ? 'Post' : 'Script'}...`;
      case 'completed':
        return `${type === 'post' ? 'Post' : 'Script'} Ready!`;
      case 'failed':
        return 'Generation Failed';
    }
  };

  const getStatusMessage = () => {
    if (error) return error;
    if (message) return message;

    switch (status) {
      case 'queued':
        return 'Your request is queued. This will only take a moment...';
      case 'processing':
        return `AI is generating your ${type === 'post' ? 'post' : 'script'}. Please wait...`;
      case 'completed':
        return `Your ${type === 'post' ? 'post' : 'script'} is ready! Opening editor...`;
      case 'failed':
        return 'Something went wrong. Please try again.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          )}
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside during generation
            if (!canClose) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing with Escape key during generation
            if (!canClose) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-4">
                {/* Status Icon */}
                <div className="flex items-center justify-center">
                  {getStatusIcon()}
                </div>

                {/* Status Title */}
                <h2 className="text-xl font-semibold text-gray-900">
                  {getStatusTitle()}
                </h2>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
          {/* Progress Bar */}
          {(status === 'queued' || status === 'processing') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-[#D4A855] to-[#CEA54F] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Message */}
          <p className="text-center text-sm text-gray-600">
            {getStatusMessage()}
          </p>

          {/* Generation Tips (only show while processing) */}
          {status === 'processing' && (
            <div className="mt-2 rounded-lg bg-amber-50 p-3 border border-amber-100">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#CEA54F] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-900">
                  <strong>Tip:</strong> AI is analyzing your prompt and creating{' '}
                  {type === 'post' ? 'a stunning visual with captions' : 'a detailed scene-by-scene script'}.
                  This usually takes 15-30 seconds.
                </p>
              </div>
            </div>
          )}

          {/* Error Action Button */}
          {status === 'failed' && (
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
            >
              Close
            </button>
          )}
        </div>

        {/* Close Button - Only show when generation is complete or failed */}
        {canClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
