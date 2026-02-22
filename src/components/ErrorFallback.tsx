import React from 'react';

interface Props {
  error: Error | null;
  message?: string;
}

export function ErrorFallback({ error, message = 'Something went wrong.' }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f5f5f5',
        color: '#333',
      }}
    >
      <h1 style={{ marginBottom: 16, fontSize: 24 }}>Travel Planning App</h1>
      <p style={{ marginBottom: 8 }}>{message}</p>
      {error && (
        <pre
          style={{
            maxWidth: '100%',
            overflow: 'auto',
            padding: 16,
            backgroundColor: '#fee',
            borderRadius: 8,
            fontSize: 12,
            textAlign: 'left',
          }}
        >
          {error.message}
        </pre>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.hasError} />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
