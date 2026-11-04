import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DumbbellIcon,
  CalendarIcon,
  ChartIcon,
  HeartIcon,
  UserIcon,
  LogoutIcon,
} from './Icons';

/**
 * Lista de rutas principales del Sidebar según el Diseño B de FORZA.
 */
export const mainNavLinks = [
  { name: 'Inicio', path: '/', icon: HomeIcon, end: true },
  { name: 'Ejercicios', path: '/ejercicios', icon: DumbbellIcon },
  { name: 'Rutinas', path: '/rutinas', icon: CalendarIcon },
  { name: 'Progreso', path: '/dashboard', icon: ChartIcon },
  { name: 'Favoritos', path: '/favoritos', icon: HeartIcon },
];

/**
 * Componente modular con los ítems de navegación.
 * Reutilizable tanto en el Sidebar fijo de escritorio como en el Offcanvas móvil.
 *
 * @param {Function} onItemClick - Callback opcional para cerrar el menú en móviles tras seleccionar una ruta.
 * @param {Function} onLogout - Callback opcional para conectar con el futuro módulo de autenticación.
 */
function NavigationItems({ onItemClick, onLogout }) {
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="sidebar-nav-container">
      {/* Navegación Principal */}
      <nav className="sidebar-nav-main" aria-label="Navegación principal">
        <ul className="sidebar-nav-list">
          {mainNavLinks.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="sidebar-nav-item">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link active' : 'sidebar-link'
                  }
                  onClick={handleClick}
                >
                  <span className="sidebar-link-icon">
                    <IconComponent size={20} />
                  </span>
                  <span className="sidebar-link-text">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Separador inferior */}
      <div className="sidebar-divider" role="separator" />

      {/* Navegación Secundaria (Perfil y Cerrar Sesión) */}
      <div className="sidebar-nav-secondary">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
              onClick={handleClick}
            >
              <span className="sidebar-link-icon">
                <UserIcon size={20} />
              </span>
              <span className="sidebar-link-text">Mi Perfil</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <button
              type="button"
              className="sidebar-link sidebar-logout-btn"
              onClick={handleLogoutClick}
              aria-label="Cerrar sesión"
            >
              <span className="sidebar-link-icon">
                <LogoutIcon size={20} />
              </span>
              <span className="sidebar-link-text">Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationItems;

