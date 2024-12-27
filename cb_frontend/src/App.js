import React, { Suspense, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Outlet, ScrollRestoration, Navigate } from 'react-router-dom';
import LoginView from "./Components/Views/login.view";
import GalleryView from "./Components/Views/gallery.view";
import BurgerMenu from "./Components/Navbar/burger_menu.component";
import './Styles/main.css';
import MainView from "./Components/Views/main.view";
import { AnimatePresence } from "framer-motion";
import {setShouldShowIntro, shouldShowIntro} from "./Hooks/UserDataHandler";
import CreateBook from "./Components/Views/CreateBook";
import Popup from "./Components/Popup";
import ErrorBoundaryWrapper from './Components/ErrorBoundary';
import Feedback from './Components/Feedback/feedback';
import { isUserLoggedIn } from './Hooks/UserDataHandler';
import InteractiveDemo from './Components/LandingPage/InteractiveDemo';
import About from './Components/Views/About';
import AuthSuccess from './Components/Auth/AuthSuccess';
import Profile from "./Components/Views/Profile";
import Payment from "./Components/Views/Payment";
import { getUserData } from './Hooks/UserDataHandler';
import Admin from './Components/Views/Admin';
import { AppInsightsErrorBoundary } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, browserHistory, setAuthenticatedUser } from './utils/appInsights';
import { usePageTracking } from './utils/usePageTracking';
import PropTypes from 'prop-types';
import { useAppInsights } from './utils/useAppInsights';

const ProtectedRoute = ({ children }) => {
  if (!isUserLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const userData = getUserData();
  
  if (!userData || !userData.isAdmin) {
      return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = () => {    
    usePageTracking();
    
    useEffect(() => {
        const userData = getUserData();
        setAuthenticatedUser(userData);
    }, []);

    return (
        <ErrorBoundaryWrapper>
            <Popup />
            <BurgerMenu />
            <Feedback />
            <div className="page-container">
              <main className="main-content">
                  <ScrollRestoration />
                  <Outlet />
              </main>
            </div>
        </ErrorBoundaryWrapper>
    )
};

const errorElement = () => {
  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Try again
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryWrapper>
      <AppLayout />
    </ErrorBoundaryWrapper>,
    errorElement: errorElement(),
    children: [
      {
        element: <ProtectedRoute><Outlet /></ProtectedRoute>,
        children: [
          { 
            path: '/create', 
            element: <ErrorBoundaryWrapper><CreateBook /></ErrorBoundaryWrapper>,
          },
          { 
            path: '/gallery', 
            element: <ErrorBoundaryWrapper><GalleryView /></ErrorBoundaryWrapper>,
          },
          { 
            path: '/profile', 
            element: <ErrorBoundaryWrapper><Profile /></ErrorBoundaryWrapper>,
          },
          {
            path: '/admin',
            element: <AdminRoute><ErrorBoundaryWrapper><Admin /></ErrorBoundaryWrapper></AdminRoute>,
          },
         
        ]
      },
      {
        path: '/payment',
        element: <ErrorBoundaryWrapper><Payment /></ErrorBoundaryWrapper>,
      },
      {
        path: '/payment/success',
        element: <ErrorBoundaryWrapper><Navigate to="/profile" replace /></ErrorBoundaryWrapper>,
      },
      {
        path: '/payment/cancel',
        element: <ErrorBoundaryWrapper><Navigate to="/payment" replace /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/about', 
        element: <ErrorBoundaryWrapper><About /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/login', 
        element: <ErrorBoundaryWrapper><LoginView /></ErrorBoundaryWrapper>,
      },    
      { 
        path: '/', 
        element: <ErrorBoundaryWrapper><MainView /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/demo', 
        element: <ErrorBoundaryWrapper><InteractiveDemo /></ErrorBoundaryWrapper>,
      },
      { 
        path: '/auth-success', 
        element: <AuthSuccess />,
      },
    ]
  }
], {
    history: browserHistory
});

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default function TranslatedApp() {
    const { trackException } = useAppInsights();
    return (
        <Suspense fallback="...loading page...">
            <AppInsightsErrorBoundary 
                onError={(error) => {
                    trackException(error, 1);
                    return errorElement();
                }} 
                appInsights={reactPlugin}
            >
                <RouterProvider router={router} />
            </AppInsightsErrorBoundary>
        </Suspense>
    );
}
