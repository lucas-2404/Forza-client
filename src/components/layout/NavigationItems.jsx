
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

// Enlaces principales del Sidebar
export const mainNavLinks = [
  { name: 'Inicio', path: '/', icon: HomeIcon, end: true },
  { name: 'Ejercicios', path: '/ejercicios', icon: DumbbellIcon },
  { name: 'Rutinas', path: '/rutinas', icon: CalendarIcon },
  { name: 'Progreso', path: '/dashboard', icon: ChartIcon },
  { name: 'Favoritos', path: '/favoritos', icon: HeartIcon },
];

// Clases Bootstrap reutilizadas para los enlaces
const clasesEnlace =
  'sidebar-link d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100';

function NavigationItems({ onItemClick, onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Actualizar usuario al cambiar de ruta
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

  // Cerrar el menú lateral en dispositivos móviles
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // Cerrar sesión y regresar al Login
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

  // Aplicar la clase active cuando estamos en la ruta
  const obtenerClaseEnlace = ({ isActive }) =>
    isActive ? `${clasesEnlace} active` : clasesEnlace;

  return (
    <div className="d-flex flex-column flex-grow-1 justify-content-between p-3">

      {/* Navegación principal */}
      <nav aria-label="Navegación principal">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          {mainNavLinks.map((item) => {
            const IconComponent = item.icon;

            return (
              <li key={item.path} className="w-100">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={obtenerClaseEnlace}
                  onClick={handleClick}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <IconComponent size={20} />
                  </span>

                  <span className="flex-grow-1">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navegación secundaria */}
      <div>
        <div className="border-top border-secondary my-3" role="separator" />

        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">

          {/* Mi Perfil */}
          <li className="w-100">
            <NavLink
              to="/perfil"
              className={obtenerClaseEnlace}
              onClick={handleClick}
            >
              <span
                className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                aria-hidden="true"
              >
                <UserIcon size={20} />
              </span>

              <span className="flex-grow-1">Mi Perfil</span>
            </NavLink>
          </li>

          {/* Mostrar Cerrar sesión o Login/Registro */}
          {usuario ? (
            <li className="w-100">
              <button
                type="button"
                className={`${clasesEnlace} sidebar-logout-btn border-0 bg-transparent text-start`}
                onClick={handleLogoutClick}
                aria-label="Cerrar sesión"
              >
                <span
                  className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <LogoutIcon size={20} />
                </span>

                <span className="flex-grow-1">Cerrar sesión</span>
              </button>
            </li>
          ) : (
            <>
              <li className="w-100">
                <NavLink
                  to="/login"
                  className={obtenerClaseEnlace}
                  onClick={handleClick}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    🔐
                  </span>

                  <span className="flex-grow-1">Iniciar sesión</span>
                </NavLink>
              </li>

              <li className="w-100">
                <NavLink
                  to="/registro"
                  className={obtenerClaseEnlace}
                  onClick={handleClick}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    ⚡
                  </span>

                  <span className="flex-grow-1">Registrarse</span>
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
