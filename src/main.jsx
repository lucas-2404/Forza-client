import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Estilos de Bootstrap (base estructural y responsive)
import 'bootstrap/dist/css/bootstrap.min.css';

// Estilos personalizados de FORZA (identidad visual, colores y ajustes)
import './styles/global.css';

// Renderizado de la aplicación en el elemento raíz del DOM (#root)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

