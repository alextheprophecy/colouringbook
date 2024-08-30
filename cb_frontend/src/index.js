import React from 'react';
import ReactDOM from 'react-dom/client';
import TranslatedApp from "./App";
import './i18n'; //load translation files from /public/locales

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TranslatedApp/>
  </React.StrictMode>
);
