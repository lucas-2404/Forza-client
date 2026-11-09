import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Páginas existentes de la aplicación (desarrolladas por el equipo)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import EjerciciosPage from '../pages/EjerciciosPage';
import RutinaPage from '../pages/RutinaPage';
import PerfilPage from '../pages/PerfilPage';
import NotFoundPage from '../pages/NotFoundPage';
import FavoritosPage from '../pages/FavoritosPage';
import AlimentacionPage from '../pages/AlimentacionPage';

// Páginas del módulo de Rutinas (feature/rutinas)
import FormularioRutinaPage from '../pages/FormularioRutinaPage';

/**
 * Definición centralizada de las Rutas de FORZA.
 * Integra el nuevo Layout (Diseño B) manteniendo intactos los componentes de los compañeros.
 */
function Rutas() {
  return (
    <Routes>
      {/* Rutas envueltas en el Layout general (Sidebar + Topbar + Outlet + Footer) */}
      <Route path="/" element={<Layout />}>
        {/* 1. Inicio */}
        <Route index element={<HomePage />} />

        {/* 2. Ejercicios */}
        <Route path="ejercicios" element={<EjerciciosPage />} />

        {/* 3. Rutinas */}
        <Route path="rutinas" element={<RutinaPage />} />
        <Route path="rutinas/nueva" element={<FormularioRutinaPage />} />
        <Route path="rutinas/editar/:id" element={<FormularioRutinaPage />} />

        {/* 4. Progreso / Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="progreso" element={<DashboardPage />} />

        {/* 5. Favoritos (Destino preparado visualmente sin funcionalidad invasiva) */}
        <Route path="favoritos" element={<FavoritosPage />} />

        {/* 6. Alimentación */}
        <Route path="alimentacion" element={<AlimentacionPage />} />

        {/* Mi Perfil */}
        <Route path="perfil" element={<PerfilPage />} />

        {/* Módulos de Autenticación */}
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />

        {/* Ruta comodín para capturar 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Rutas;
