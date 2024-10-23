import React from 'react';
import ReactDOM from 'react-dom/client';
import TranslatedApp from "./App";

import './i18n'; //load translation files from /public/locales

import store from './redux/store';
import { Provider } from 'react-redux';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <TranslatedApp/>
    </Provider>
);
