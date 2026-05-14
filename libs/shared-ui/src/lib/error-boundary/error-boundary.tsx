import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Hexagon, AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '48px', height: '100%', minHeight: '400px', backgroundColor: 'var(--ui-gray-50)',
          borderRadius: '12px', border: '1px dashed var(--ui-gray-200)', textAlign: 'center'
        }}>
          <AlertTriangle size={48} color="var(--ui-error, #ef4444)" style={{ marginBottom: '16px' }} />
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--ui-gray-900)' }}>Something went wrong</h2>
          <p style={{ margin: '0 0 24px 0', color: 'var(--ui-gray-500)', maxWidth: '400px' }}>
            We encountered an unexpected error while loading this module. 
            {this.state.error?.message && <span style={{ display: 'block', marginTop: '8px', fontSize: '0.85em', color: 'var(--ui-gray-400)', fontFamily: 'monospace' }}>{this.state.error.message}</span>}
          </p>
          <button 
            onClick={this.handleRetry}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--ui-gray-200)',
              background: 'white', color: 'var(--ui-gray-700)', cursor: 'pointer',
              fontWeight: 500, transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--ui-gray-300)'; e.currentTarget.style.background = 'var(--ui-gray-50)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--ui-gray-200)'; e.currentTarget.style.background = 'white'; }}
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
