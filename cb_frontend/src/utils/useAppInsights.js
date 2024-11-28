import { useEffect } from 'react';
import { appInsights } from './appInsights';
import { getUserData } from '../Hooks/UserDataHandler';

export const useAppInsights = () => {
  const trackEvent = (name, properties = {}) => {
    const userData = getUserData();
    const enrichedProperties = {
      ...properties,
      userEmail: userData?.email,
      userId: userData?._id,
      userCredits: userData?.credits,
    };
    appInsights.trackEvent({ name, properties: enrichedProperties });
  };

  const trackPageView = (name, properties = {}) => {
    const userData = getUserData();
    const enrichedProperties = {
      ...properties,
      userEmail: userData?.email,
      userId: userData?._id,
    };
    appInsights.trackPageView({ name, properties: enrichedProperties });
  };

  const trackException = (error, severityLevel = 3) => {
    const userData = getUserData();
    const properties = {
      userEmail: userData?.email,
      userId: userData?._id,
    };
    appInsights.trackException({ 
      error, 
      severityLevel,
      properties 
    });
  };

  const trackMetric = (name, value, properties = {}) => {
    const userData = getUserData();
    const enrichedProperties = {
      ...properties,
      userEmail: userData?.email,
      userId: userData?._id,
    };
    appInsights.trackMetric({ 
      name, 
      average: value, 
      properties: enrichedProperties 
    });
  };

  return { 
    trackEvent, 
    trackPageView, 
    trackException, 
    trackMetric 
  };
};