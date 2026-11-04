import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Páginas de la aplicación
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import EjerciciosPage from '../pages/EjerciciosPage';
import RutinaPage from '../pages/RutinaPage';
import PerfilPage from '../pages/PerfilPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Definición centralizada de las Rutas de FORZA
 * Utiliza React Router DOM v6 con un Layout general que incluye Navbar y Footer.
 */
function Rutas() {
  return (
    <Routes>
      {/* Rutas principales envueltas en el Layout general */}
      <Route path="/" element={<Layout />}>
        {/* Ruta principal / Home */}
        <Route index element={<HomePage />} />

        {/* Módulo de Autenticación */}
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />

        {/* Módulos de Entrenamiento y Gestión */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="ejercicios" element={<EjerciciosPage />} />
        <Route path="rutinas" element={<RutinaPage />} />
        <Route path="perfil" element={<PerfilPage />} />

        {/* Ruta para capturar cualquier página no encontrada (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Rutas;

