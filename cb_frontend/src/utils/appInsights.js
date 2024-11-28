import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const reactPlugin = new ReactPlugin();

// Initialize Application Insights
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATIONKEY,
        
        // Disable all automatic dependency tracking
        disableFetchTracking: true,
        disableAjaxTracking: true,
        enableRequestHeaderTracking: false,
        enableResponseHeaderTracking: false,
        enableCorsCorrelation: false,
        
        // Keep route tracking and basic insights
        enableAutoRouteTracking: true,
        
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory }
        }
    }
});

// Load Application Insights
appInsights.loadAppInsights();

// Add method to set authenticated user
const setAuthenticatedUser = (userData) => {
    if (userData && userData.email) {
        appInsights.setAuthenticatedUserContext(
            userData.email,
            userData._id?.toString(),
            true
        );
    } else {
        appInsights.clearAuthenticatedUserContext();
    }
};

// Export both the plugin and history
export { reactPlugin, appInsights, browserHistory, setAuthenticatedUser }; 