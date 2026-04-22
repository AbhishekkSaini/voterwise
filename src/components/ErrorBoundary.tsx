import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches render errors in child components
 * and shows a clean fallback instead of crashing the whole app.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[VoterWise] Component error:', error, info.componentStack);
    // Track error in GA if available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" style={{
          padding: '48px 24px', textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000', marginBottom: '8px' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'rgba(60,60,67,0.6)', marginBottom: '24px', fontSize: '15px' }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#007AFF', color: '#fff', border: 'none',
              borderRadius: '980px', padding: '10px 24px',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
