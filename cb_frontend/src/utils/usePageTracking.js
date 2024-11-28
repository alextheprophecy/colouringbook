import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appInsights } from '../utils/appInsights';

export const usePageTracking = () => {
    const location = useLocation();

    /* useEffect(() => {
        // Track page view when location changes
        appInsights.trackPageView({
            name: document.title,
            uri: location.pathname + location.search
        });
    }, [location]); */
}; 