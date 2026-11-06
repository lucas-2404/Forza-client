import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import './layout.css';

/**
 * Componente Layout Principal (Diseño B: Sidebar lateral + Topbar superior).
 *
 * Refactorizado al 90 % Bootstrap:
 * - El Sidebar de escritorio usa la clase responsive nativa `d-none d-lg-flex`.
 * - El área principal usa `d-flex flex-column flex-grow-1`.
 * - El contenedor de contenidos usa `p-3 p-lg-4` eliminando media queries manuales.
 */
function Layout() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleOpenMobileMenu = () => setShowMobileMenu(true);
  const handleCloseMobileMenu = () => setShowMobileMenu(false);

  const handleLogoutVisual = () => {
    console.info('Acción visual de cierre de sesión.');
  };

  return (
    <div className="d-flex min-vh-100 w-100 overflow-hidden forza-dashboard-layout">
      {/* 1. Sidebar de Escritorio: visible solo en lg en adelante mediante Bootstrap */}
      <Sidebar
        className="d-none d-lg-flex"
        onLogout={handleLogoutVisual}
      />

      {/* 2. Menú Lateral Offcanvas de React Bootstrap para Celulares y Tablets */}
      <Offcanvas
        show={showMobileMenu}
        onHide={handleCloseMobileMenu}
        placement="start"
        className="forza-offcanvas d-lg-none"
        aria-label="Menú lateral móvil"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary px-4 py-3">
          <Offcanvas.Title className="fw-bold text-light d-flex align-items-center gap-2">
            <span style={{ color: 'var(--color-primary, #9EF01A)' }}>⚡</span>
            FORZA
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar
            onItemClick={handleCloseMobileMenu}
            onLogout={handleLogoutVisual}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. Área Principal: Topbar + Contenido (Outlet) + Footer */}
      <div className="d-flex flex-column flex-grow-1 min-vw-0 forza-main-wrapper">
        <Topbar
          onToggleMobileMenu={handleOpenMobileMenu}
          onLogout={handleLogoutVisual}
        />

        <main className="p-3 p-lg-4 flex-grow-1 w-100" id="main-content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
