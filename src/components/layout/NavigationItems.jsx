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
 * Refactorizado con utilidades Bootstrap:
 * - Listas sin viñetas con `list-unstyled m-0 p-0 d-flex flex-column gap-1`.
 * - Enlaces alineados con `d-flex align-items-center gap-3 p-2 px-3 rounded-3`.
 * - Separador semántico con `border-top border-secondary my-3`.
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
    <div className="d-flex flex-column flex-grow-1 justify-content-between p-3">
      {/* Navegación Principal */}
      <nav aria-label="Navegación principal">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          {mainNavLinks.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="w-100">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive
                      ? 'sidebar-link active d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100'
                      : 'sidebar-link d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100'
                  }
                  onClick={handleClick}
                >
                  <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true">
                    <IconComponent size={20} />
                  </span>
                  <span className="flex-grow-1">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Separador inferior con borde nativo de Bootstrap */}
      <div className="border-top border-secondary my-3" role="separator" />

      {/* Navegación Secundaria (Perfil y Cerrar Sesión) */}
      <div>
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          <li className="w-100">
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                isActive
                  ? 'sidebar-link active d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100'
                  : 'sidebar-link d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100'
              }
              onClick={handleClick}
            >
              <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true">
                <UserIcon size={20} />
              </span>
              <span className="flex-grow-1">Mi Perfil</span>
            </NavLink>
          </li>

          <li className="w-100">
            <button
              type="button"
              className="sidebar-link sidebar-logout-btn d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100 border-0 bg-transparent text-start"
              onClick={handleLogoutClick}
              aria-label="Cerrar sesión"
            >
              <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true">
                <LogoutIcon size={20} />
              </span>
              <span className="flex-grow-1">Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationItems;
