import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const reactPlugin = new ReactPlugin();

// Initialize Application Insights
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: process.env.REACT_APP_APPINSIGHTS_INSTRUMENTATIONKEY,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableAutoRouteTracking: true,
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory }
        }
    }
});

// Load Application Insights
appInsights.loadAppInsights();

// Export both the plugin and history
export { reactPlugin, appInsights, browserHistory }; 