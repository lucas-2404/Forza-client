import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
 * @param {Function} onLogout - Callback opcional para conectar con el módulo de autenticación.
 */
function NavigationItems({ onItemClick, onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Actualizar estado de sesión cada vez que cambia la ruta
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('forza_user');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }, [location]);

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    localStorage.removeItem('forza_token');
    localStorage.removeItem('forza_user');
    setUsuario(null);
    if (onLogout) {
      onLogout();
    }
    if (onItemClick) {
      onItemClick();
    }
    navigate('/login');
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

      {/* Navegación Secundaria (Perfil, Login/Registro o Cerrar Sesión) */}
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

          {usuario ? (
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
          ) : (
            <>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link active' : 'sidebar-link'
                  }
                  onClick={handleClick}
                >
                  <span className="sidebar-link-icon">🔐</span>
                  <span className="sidebar-link-text">Iniciar sesión</span>
                </NavLink>
              </li>

              <li className="sidebar-nav-item">
                <NavLink
                  to="/registro"
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link active' : 'sidebar-link'
                  }
                  onClick={handleClick}
                >
                  <span className="sidebar-link-icon">⚡</span>
                  <span className="sidebar-link-text">Registrarse</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default NavigationItems;

