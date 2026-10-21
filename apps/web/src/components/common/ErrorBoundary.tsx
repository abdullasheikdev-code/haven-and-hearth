import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Haven & Hearth UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-ivory-300 shadow-editorial space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-900 text-mango-300 flex items-center justify-center mx-auto shadow-soft">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
              System Resilience Gate
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">
              Restoring Sanctuary
            </h2>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              We encountered a minor render anomaly. The hospitality engine has isolated the issue to protect your session.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold hover:bg-forest-900 transition-colors shadow-soft"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <a
                href="#/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50 text-charcoal-800 text-xs font-bold hover:bg-ivory-100 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
