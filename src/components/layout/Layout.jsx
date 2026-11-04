import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Componente Layout principal.
 * Mantiene la barra de navegación superior y el pie de página fijos,
 * renderizando en el medio la página activa correspondiente mediante <Outlet />.
 */
function Layout() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

