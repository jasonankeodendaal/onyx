import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, Trash2 } from './Icons';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
          <div className="bg-onyx-900 border border-red-900/50 rounded-xl p-8 max-w-md text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">System Critical</h1>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              The application encountered a fatal error. This is often caused by an invalid Supabase Configuration or a network connectivity issue.
            </p>
            
            <div className="p-4 bg-black/50 rounded text-left text-xs text-red-400 font-mono mb-6 overflow-auto max-h-32 border border-red-900/30">
              {this.state.error?.message || 'Unknown Error'}
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('onyx_supabase_config');
                window.location.reload();
              }}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Configuration & Restart</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}