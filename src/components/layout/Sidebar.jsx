import { Link } from 'react-router-dom';
import { DumbbellIcon } from './Icons';
import NavigationItems from './NavigationItems';

/**
 * Componente Sidebar Lateral (Diseño B de FORZA).
 *
 * Muestra el logotipo con la mancuerna verde lima, el menú de navegación principal
 * y la sección inferior con perfil y cierre de sesión.
 *
 * @param {Function} onItemClick - Callback opcional para cerrar el menú en móviles (Offcanvas).
 * @param {Function} onLogout - Callback opcional para el futuro servicio de logout.
 * @param {string} className - Clases CSS adicionales.
 */
function Sidebar({ onItemClick, onLogout, className = '' }) {
  const handleLogoClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <aside className={`forza-sidebar ${className}`} aria-label="Barra lateral de navegación">
      {/* Encabezado con Logotipo FORZA */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand" onClick={handleLogoClick}>
          <span className="sidebar-brand-icon" aria-hidden="true">
            <DumbbellIcon size={28} />
          </span>
          <span className="sidebar-brand-text">FORZA</span>
        </Link>
      </div>

      {/* Ítems de navegación reutilizables */}
      <NavigationItems onItemClick={onItemClick} onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;

