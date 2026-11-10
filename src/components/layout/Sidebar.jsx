import { Link } from 'react-router-dom';
import { DumbbellIcon } from './Icons';
import NavigationItems from './NavigationItems';

/**
 * Componente Sidebar Lateral (Diseño B de FORZA).
 *
 * Refactorizado al 90 % Bootstrap:
 * - Estructura flexbox con `flex-column`.
 * - Encabezado alineado con `d-flex align-items-center px-4 border-bottom border-secondary`.
 * - Enlace del logo con utilidades `d-inline-flex align-items-center gap-2 text-decoration-none`.
 */
function Sidebar({ onItemClick, onLogout, className = '' }) {
  const handleLogoClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <aside className={`forza-sidebar flex-column ${className}`} aria-label="Barra lateral de navegación">
      {/* Encabezado con Logotipo FORZA */}
      <div className="sidebar-header d-flex align-items-center px-4 border-bottom border-secondary">
        <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none text-white" onClick={handleLogoClick}>
          <span className="sidebar-brand-icon d-flex" aria-hidden="true">
            <DumbbellIcon size={28} />
          </span>
          <span className="sidebar-brand-text fw-bold fs-4">FORZA</span>
        </Link>
      </div>

      {/* Ítems de navegación reutilizables */}
      <NavigationItems onItemClick={onItemClick} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;
