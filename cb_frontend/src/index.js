import React from 'react';
import ReactDOM from 'react-dom/client';
import ColourBookify from "./Components/colour_bookify.component";
import GenerateBook from "./Components/generate_book.component";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GenerateBook/>
  </React.StrictMode>
);
