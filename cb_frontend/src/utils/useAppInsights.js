import { useEffect } from 'react';
import { appInsights } from '../utils/appInsights';

export const useAppInsights = () => {
  const trackEvent = (name, properties = {}) => {
    appInsights.trackEvent({ name, properties });
  };

  const trackPageView = (name, properties = {}) => {
    appInsights.trackPageView({ name, properties });
  };

  const trackException = (error, severityLevel = 3) => {
    appInsights.trackException({ error, severityLevel });
  };

  return { trackEvent, trackPageView, trackException };
};