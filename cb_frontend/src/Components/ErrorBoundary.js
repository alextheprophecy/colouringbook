import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/websiteSlice';
import { appInsights } from '../utils/appInsights';
import { getUserData } from '../Hooks/UserDataHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Track error in App Insights
    const userData = getUserData();
    appInsights.trackException({
      error,
      properties: {
        userEmail: userData?.email,
        userId: userData?._id,
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack
      },
      severityLevel: 1 // Error level
    });
    
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {t('error.oops-something-went-wrong')} </h2>
              <p className="mt-2 text-sm text-gray-600">
                {this.state.error?.message || t('error.an-unexpected-error-occurred')}
              </p>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('error.try-again')} </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to access Redux dispatch
const ErrorBoundaryWrapper = ({ children }) => {
  const dispatch = useDispatch();

  const handleError = (error) => {
    dispatch(addNotification({
      type: 'error',
      message: error.message || 'Unknown error',
      duration: 5000
    }));
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper; 