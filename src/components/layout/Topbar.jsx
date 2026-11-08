import { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  SearchIcon,
  BellIcon,
  MenuIcon,
  UserIcon,
  DumbbellIcon,
} from './Icons';

// Barra superior de FORZA
// Diseño responsive con Bootstrap y autenticación

function Topbar({
  onToggleMobileMenu,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onLogout,
}) {
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Actualizar el usuario cuando cambia la ruta
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

  // Mantener sincronizado el buscador
  useEffect(() => {
    setInternalSearch(searchValue);
  }, [searchValue]);

  // Escribir en el buscador
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setInternalSearch(valor);

    if (onSearchChange) {
      onSearchChange(valor);
    }
  };

  // Enviar la búsqueda
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (onSearchSubmit) {
      onSearchSubmit(internalSearch);
    }
  };

  // Cerrar sesión
  const handleLogoutClick = () => {
    localStorage.removeItem('forza_token');
    localStorage.removeItem('forza_user');

    setUsuario(null);

    if (onLogout) {
      onLogout();
    }

    navigate('/login');
  };

  // Obtener las iniciales del usuario
  const obtenerIniciales = () => {
    if (!usuario || !usuario.nombre) {
      return 'FZ';
    }

    const partes = usuario.nombre.trim().split(' ').filter(Boolean);

    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }

    return partes[0]?.slice(0, 2).toUpperCase() || 'FZ';
  };

  return (
    <header className="forza-topbar px-3 px-lg-4 d-flex align-items-center sticky-top border-bottom border-secondary">

      <div className="d-flex align-items-center justify-content-between w-100 gap-2 gap-md-3">

        {/* IZQUIERDA: Menú móvil, logo y buscador */}
        <div
          className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1"
          style={{ minWidth: 0, maxWidth: '460px' }}
        >

          {/* Botón hamburguesa para móvil y tablet */}
          <button
            type="button"
            className="topbar-menu-toggle d-lg-none d-inline-flex align-items-center justify-content-center"
            onClick={onToggleMobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <MenuIcon size={24} />
          </button>

          {/* Logo FORZA visible en móvil y tablet */}
          <div className="d-lg-none">
            <Link
              to="/"
              className="d-inline-flex align-items-center gap-2 text-decoration-none text-white fw-bold fs-5"
            >
              <span
                className="d-flex"
                style={{ color: 'var(--color-primary, #9EF01A)' }}
              >
                <DumbbellIcon size={22} />
              </span>

              <span>FORZA</span>
            </Link>
          </div>

          {/* Buscador responsive */}
          <form
            className="position-relative d-none d-sm-flex align-items-center w-100"
            style={{ maxWidth: '360px', minWidth: 0 }}
            onSubmit={handleFormSubmit}
          >
            <span
              className="position-absolute start-0 ms-3 text-secondary d-flex align-items-center pe-none"
              aria-hidden="true"
            >
              <SearchIcon size={17} />
            </span>

            <input
              type="text"
              className="topbar-search-input w-100 rounded-pill text-white ps-5 pe-3"
              placeholder="Buscar ejercicios, rutinas..."
              value={internalSearch}
              onChange={handleInputChange}
              aria-label="Buscar ejercicios o rutinas"
            />
          </form>
        </div>

        {/* DERECHA: Notificaciones y acceso / perfil de usuario */}
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
          {/* Botón visual de notificaciones */}
          <button
            type="button"
            className="topbar-icon-btn position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <BellIcon size={20} />

            <span
              className="notif-indicator position-absolute rounded-circle"
              aria-hidden="true"
            />
          </button>

          {/* Si el usuario está logueado: Avatar + Nombre con menú para ir a Mi Perfil o Cerrar sesión */}
          {usuario ? (
            <Dropdown align="end" className="topbar-user-dropdown">
              <Dropdown.Toggle
                variant="link"
                id="user-profile-dropdown"
                className="p-0 border-0 text-decoration-none d-flex align-items-center gap-2"
                aria-label="Menú de usuario"
              >
                <div className="topbar-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                  <span className="avatar-initials">{obtenerIniciales()}</span>
                </div>
                <span className="d-none d-sm-inline text-light fw-semibold small">
                  {usuario.nombre}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="topbar-dropdown-menu border border-secondary shadow-lg rounded-3 py-2 mt-2">
                <div className="dropdown-user-header px-3 py-2">
                  <p className="user-name mb-0 fw-bold text-light">{usuario.nombre}</p>
                  <p className="user-email mb-0 text-secondary small">{usuario.email}</p>
                </div>

                <Dropdown.Divider className="border-secondary my-1" />

                <Dropdown.Item
                  as={Link}
                  to="/perfil"
                  className="dropdown-item-forza d-flex align-items-center px-3 py-2"
                >
                  <UserIcon size={16} className="me-2" />
                  Mi Perfil
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/dashboard"
                  className="dropdown-item-forza px-3 py-2"
                >
                  Progreso
                </Dropdown.Item>

                <Dropdown.Divider className="border-secondary my-1" />

                <Dropdown.Item
                  as="button"
                  className="dropdown-item-forza text-danger px-3 py-2 w-100 text-start"
                  onClick={handleLogoutClick}
                >
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            /* Si NO está logueado: Botones directos de Iniciar sesión y Registrarse */
            <div className="d-flex align-items-center gap-2">
              <Button
                as={Link}
                to="/login"
                className="forza-btn-outline btn-sm py-1 px-3"
              >
                Iniciar sesión
              </Button>

              <Button
                as={Link}
                to="/registro"
                className="forza-btn-primary btn-sm py-1 px-3"
              >
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;