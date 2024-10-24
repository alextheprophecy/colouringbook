import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-red-600 font-semibold mb-2">Something went wrong</h2>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Reload Page
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4">
                            <summary className="cursor-pointer text-red-500">Error Details</summary>
                            <pre className="mt-2 text-sm text-red-800 whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
