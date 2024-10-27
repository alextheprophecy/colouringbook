import React, { Suspense, useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom';
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

const AppLayout = () => {

    const resetScrollPosition = () => {
        window.scrollTo(0, 0);
    };

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }


    useEffect(() => {
        // Handle focusout scroll reset
        const debouncedReset = debounce(resetScrollPosition, 100);
        window.addEventListener('focusout', debouncedReset);
        
        return () => window.removeEventListener('focusout', debouncedReset);
    }, []);
    
    return (
        <>
            <Popup />
            <BurgerMenu />
            <div className="page-container">
            <main className="main-content">
                <ScrollRestoration />
                <Outlet />
            </main>
            </div>
        </>
    )
};

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <MainView /> },
          { path: '/login', element: <LoginView /> },
          { path: '/playground', element: <PlaygroundView /> },
        ]
      },
      { path: '/create', element: <CreateBook /> },
      { path: '/gallery', element: <GalleryView /> },
      { path: '/test', element: <PlaygroundView /> },
    ]
  }
]);

export default function TranslatedApp() {
    const [showIntro, setShowIntro] = useState(shouldShowIntro);
   
    
    return (
        <Suspense fallback="...loading page...">
            <RouterProvider router={router} />
            <AnimatePresence>
                {showIntro && <IntroScreen />}
            </AnimatePresence>
        </Suspense>
    );
}
