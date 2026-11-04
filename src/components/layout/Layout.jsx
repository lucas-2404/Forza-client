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
 * Estructura:
 * - Escritorio: Sidebar fijo a la izquierda (100vh) + Contenedor derecho (Topbar + Outlet + Footer).
 * - Móvil / Tablet: Sidebar oculto por defecto, se activa como Offcanvas desde el botón hamburguesa del Topbar.
 */
function Layout() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleOpenMobileMenu = () => setShowMobileMenu(true);
  const handleCloseMobileMenu = () => setShowMobileMenu(false);

  const handleLogoutVisual = () => {
    // Control visual preparado para cuando el compañero de Autenticación conecte la lógica
    console.info('Acción visual de cierre de sesión.');
  };

  return (
    <div className="forza-dashboard-layout">
      {/* 1. Sidebar Fijo para Escritorio (oculto en móviles mediante CSS) */}
      <Sidebar
        className="desktop-only"
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
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-bold text-light d-flex align-items-center gap-2">
            <span style={{ color: 'var(--color-primary, #9EF01A)' }}>⚡</span>
            FORZA
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar
            onItemClick={handleCloseMobileMenu}
            onLogout={handleLogoutVisual}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. Área Principal: Topbar + Contenido de Rutas (Outlet) + Footer */}
      <div className="forza-main-wrapper">
        <Topbar
          onToggleMobileMenu={handleOpenMobileMenu}
          onLogout={handleLogoutVisual}
        />

        <main className="forza-content-area" id="main-content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
