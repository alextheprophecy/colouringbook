import React from 'react';
import ReactDOM from 'react-dom/client';
import TranslatedApp from "./App";

import './i18n'; //load translation files from /public/locales

import store, { persistor } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <TranslatedApp/>
        </PersistGate>
    </Provider>
);
