/* ============================================
   Application Entry Point
   📚 WHAT: React app শুরু হয় এখান থেকে
   📚 ReactDOM.createRoot = React 18 way
   📚 document.getElementById('root') = public/index.html এর div
   ============================================ */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
