import dynamic from 'next/dynamic';
import React from 'react';
const Error = dynamic(() => import('./error'));

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: any): void {
    const isProd = process.env.NODE_ENV === 'production';
    import('@sentry/browser').then((Sentry) => {
      if (Sentry && isProd) {
        Sentry.captureException(error, { extra: errorInfo });
      }
    });
  }

  render() {
    if (this.state?.hasError) {
      return <Error />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
