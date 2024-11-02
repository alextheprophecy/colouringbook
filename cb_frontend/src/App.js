import React, { Suspense, useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Outlet, ScrollRestoration, Navigate } from 'react-router-dom';
import LoginView from "./Components/Views/login.view";
import GalleryView from "./Components/Views/gallery.view";
import PlaygroundView from "./Components/Views/playground.view";
import ScribbleText from "./Components/UI/ui_scribble_text.component";
import BurgerMenu from "./Components/Navbar/burger_menu.component";
import Navbar from "./Components/Navbar/navbar.component";
import Background from './Components/UI/background.component';
import './Styles/main.css';
import MainView from "./Components/Views/main.view";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./Components/UI/intro_screen.component";
import {setShouldShowIntro, shouldShowIntro} from "./Hooks/UserDataHandler";
import CreateBook from "./Components/Views/CreateBook";
import Popup from "./Components/Popup";
import ErrorBoundaryWrapper from './Components/ErrorBoundary';
import { useSelector } from 'react-redux';
import Feedback from './Components/Feedback/feedback';
import { isUserLoggedIn } from './Hooks/UserDataHandler';

const ProtectedRoute = ({ children }) => {
  if (!isUserLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppLayout = () => {    
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

const errorElement = () => (<ErrorBoundaryWrapper>
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
</ErrorBoundaryWrapper>);

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
            path: '/test', 
            element: <ErrorBoundaryWrapper><PlaygroundView /></ErrorBoundaryWrapper>,
          },
          { 
            path: '/playground', 
            element: <ErrorBoundaryWrapper><PlaygroundView /></ErrorBoundaryWrapper>,
          },
        ]
      },
      { 
        path: '/login', 
        element: <ErrorBoundaryWrapper><LoginView /></ErrorBoundaryWrapper>,
      },    
      { 
        path: '/', 
        element: <ErrorBoundaryWrapper><MainView /></ErrorBoundaryWrapper>,
      },
    ]
  }
]);
export default function TranslatedApp() {
    const [showIntro, setShowIntro] = useState(shouldShowIntro);
   
    
    return (
        <Suspense fallback="...loading page...">
            <RouterProvider router={router} />
            {/* <AnimatePresence>
                {showIntro && <IntroScreen />}
            </AnimatePresence> */}
        </Suspense>
    );
}
