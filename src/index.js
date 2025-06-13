import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Mengimpor styling global
import App from './App';

// Ini adalah titik awal di mana React mulai bekerja
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);