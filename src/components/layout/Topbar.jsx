import { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchIcon, BellIcon, MenuIcon, UserIcon, DumbbellIcon } from './Icons';

/**
 * Componente Topbar Superior (Diseño B de FORZA).
 *
 * Incluye el botón hamburguesa móvil, barra de búsqueda visual,
 * botón de notificaciones y menú desplegable del perfil con React Bootstrap.
 *
 * @param {Function} onToggleMobileMenu - Abre el menú lateral Offcanvas en celulares/tablets.
 * @param {string} searchValue - Valor visual del input de búsqueda.
 * @param {Function} onSearchChange - Callback opcional para cuando se escribe en la búsqueda.
 * @param {Function} onSearchSubmit - Callback opcional al presionar Enter.
 * @param {Function} onLogout - Callback opcional para el cierre de sesión.
 */
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

  // Sincronizar usuario desde localStorage al cambiar de ruta
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

  const handleInputChange = (e) => {
    setInternalSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(internalSearch);
    }
  };

  // Cerrar sesión limpiando localStorage y redirigiendo a /login
  const handleLogoutClick = () => {
    localStorage.removeItem('forza_token');
    localStorage.removeItem('forza_user');
    setUsuario(null);
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Obtener iniciales del nombre del usuario o usar "FZ" por defecto
  const obtenerIniciales = () => {
    if (!usuario || !usuario.nombre) return 'FZ';
    const partes = usuario.nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return usuario.nombre.slice(0, 2).toUpperCase();
  };

  return (
    <header className="forza-topbar">
      <div className="topbar-inner">
        {/* Lado Izquierdo: Botón Menú Móvil + Barra de Búsqueda Visual */}
        <div className="topbar-left">
          {/* Botón hamburguesa visible solo en dispositivos móviles y tablets */}
          <button
            type="button"
            className="topbar-menu-toggle d-lg-none"
            onClick={onToggleMobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <MenuIcon size={24} />
          </button>

          {/* Logotipo visible solo en móvil cuando el sidebar de escritorio está oculto */}
          <div className="topbar-mobile-logo d-lg-none">
            <Link to="/" className="topbar-mobile-brand">
              <span className="brand-icon">
                <DumbbellIcon size={22} />
              </span>
              <span className="brand-text">FORZA</span>
            </Link>
          </div>

          {/* Campo de búsqueda visual */}
          <form className="topbar-search-form" onSubmit={handleFormSubmit}>
            <span className="search-icon" aria-hidden="true">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Buscar ejercicios, rutinas..."
              value={internalSearch}
              onChange={handleInputChange}
              aria-label="Buscar ejercicios o rutinas"
            />
          </form>
        </div>

        {/* Lado Derecho: Botones de Acceso o Notificaciones + Avatar del Perfil */}
        <div className="topbar-right">
          {!usuario && (
            <div className="d-none d-sm-flex align-items-center gap-2">
              <Button as={Link} to="/login" className="forza-btn-outline btn-sm py-1 px-3">
                Iniciar sesión
              </Button>
              <Button as={Link} to="/registro" className="forza-btn-primary btn-sm py-1 px-3">
                Registrarse
              </Button>
            </div>
          )}

          {/* Botón visual de Notificaciones con indicador verde lima */}
          <button
            type="button"
            className="topbar-icon-btn"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <BellIcon size={20} />
            <span className="notif-indicator" aria-hidden="true" />
          </button>

          {/* Menú desplegable del Perfil utilizando Dropdown de React Bootstrap */}
          <Dropdown align="end" className="topbar-user-dropdown">
            <Dropdown.Toggle
              variant="link"
              id="user-profile-dropdown"
              className="topbar-avatar-btn p-0 border-0"
              aria-label="Menú de usuario"
            >
              <div className="topbar-avatar">
                <span className="avatar-initials">{obtenerIniciales()}</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="topbar-dropdown-menu">
              {usuario ? (
                <>
                  <div className="dropdown-user-header px-3 py-2">
                    <p className="user-name mb-0 fw-bold text-light">{usuario.nombre}</p>
                    <p className="user-email mb-0 text-secondary small">{usuario.email}</p>
                  </div>

                  <Dropdown.Divider className="border-secondary my-1" />

                  <Dropdown.Item as={Link} to="/perfil" className="dropdown-item-forza">
                    <UserIcon size={16} className="me-2" />
                    Mi Perfil
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item-forza">
                    Progreso
                  </Dropdown.Item>

                  <Dropdown.Divider className="border-secondary my-1" />

                  <Dropdown.Item
                    as="button"
                    className="dropdown-item-forza text-danger"
                    onClick={handleLogoutClick}
                  >
                    Cerrar sesión
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <div className="dropdown-user-header px-3 py-2">
                    <p className="user-name mb-0 fw-bold text-light">Invitado</p>
                    <p className="user-email mb-0 text-secondary small">Sin sesión activa</p>
                  </div>

                  <Dropdown.Divider className="border-secondary my-1" />

                  <Dropdown.Item as={Link} to="/login" className="dropdown-item-forza">
                    🔐 Iniciar sesión
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to="/registro" className="dropdown-item-forza">
                    ⚡ Registrarse
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Topbar;

