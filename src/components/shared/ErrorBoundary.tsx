import { Component, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In a real app, you'd send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Analytics or error reporting would go here
    }
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    if (newRetryCount <= this.maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: newRetryCount 
      });
    }
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: 0 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.state.error?.message.includes('fetch') || 
                           this.state.error?.message.includes('network');
      const hasExceededRetries = this.state.retryCount >= this.maxRetries;

      return (
        <Card className="p-6 text-center space-y-4 border-warning/20 bg-warning/5 smooth-transition animate-fade-in">
          <div className="flex justify-center">
            {isNetworkError ? (
              <WifiOff className="h-12 w-12 text-warning animate-pulse" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-warning" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isNetworkError 
                ? 'Please check your internet connection and try again.'
                : hasExceededRetries
                  ? 'Multiple attempts failed. Please refresh the page or contact support.'
                  : 'We encountered an error while loading this component. Please try again.'
              }
            </p>
            {this.state.retryCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Attempt {this.state.retryCount} of {this.maxRetries}
              </p>
            )}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-muted/50 p-3 rounded-md mt-4 border">
                <summary className="cursor-pointer font-medium hover:text-foreground smooth-transition">
                  Error details
                </summary>
                <pre className="text-xs mt-2 overflow-auto text-muted-foreground">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            {!hasExceededRetries && (
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                className="gap-2 smooth-transition hover-scale focus-ring"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button 
              onClick={this.handleReset}
              variant="secondary"
              className="gap-2 smooth-transition hover-scale focus-ring"
            >
              <Wifi className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}