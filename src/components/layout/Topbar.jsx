import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchIcon, BellIcon, MenuIcon, UserIcon, DumbbellIcon } from './Icons';

/**
 * Componente Topbar Superior (Diseño B de FORZA).
 *
 * Refactorizado al 90 % Bootstrap:
 * - Visibilidad de búsqueda con `d-none d-sm-flex` (reemplaza media query <576px).
 * - Espaciado responsive con `px-3 px-lg-4` (reemplaza media query de padding).
 * - Grilla y alineación nativa con `d-flex align-items-center justify-content-between gap-3`.
 * - Botones y desplegable basados en componentes y utilidades de Bootstrap.
 */
function Topbar({
  onToggleMobileMenu,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onLogout,
}) {
  const [internalSearch, setInternalSearch] = useState(searchValue);

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

  return (
    <header className="forza-topbar px-3 px-lg-4 d-flex align-items-center sticky-top border-bottom border-secondary">
      <div className="d-flex align-items-center justify-content-between w-100 gap-2 gap-md-3">
        {/* Lado Izquierdo: Botón Menú Móvil + Logo Móvil + Buscador */}
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1" style={{ maxWidth: '460px' }}>
          {/* Botón hamburguesa visible solo en pantallas <992px */}
          <button
            type="button"
            className="topbar-menu-toggle d-lg-none d-inline-flex align-items-center justify-content-center"
            onClick={onToggleMobileMenu}
            aria-label="Abrir menú de navegación"
          >
            <MenuIcon size={24} />
          </button>

          {/* Logotipo móvil visible solo en pantallas <992px */}
          <div className="d-lg-none">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none text-white fw-bold fs-5">
              <span className="d-flex" style={{ color: 'var(--color-primary, #9EF01A)' }}>
                <DumbbellIcon size={22} />
              </span>
              <span>FORZA</span>
            </Link>
          </div>

          {/* Campo de búsqueda visual: d-none en <576px, d-sm-flex desde 576px */}
          <form
            className="position-relative d-none d-sm-flex align-items-center w-100"
            style={{ maxWidth: '360px' }}
            onSubmit={handleFormSubmit}
          >
            <span className="position-absolute start-0 ms-3 text-secondary d-flex align-items-center pe-none" aria-hidden="true">
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

        {/* Lado Derecho: Notificaciones + Avatar del Perfil */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Botón visual de Notificaciones */}
          <button
            type="button"
            className="topbar-icon-btn position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
            aria-label="Notificaciones"
            title="Notificaciones"
          >
            <BellIcon size={20} />
            <span className="notif-indicator position-absolute rounded-circle" aria-hidden="true" />
          </button>

          {/* Menú desplegable del Perfil con Dropdown de React Bootstrap */}
          <Dropdown align="end" className="topbar-user-dropdown">
            <Dropdown.Toggle
              variant="link"
              id="user-profile-dropdown"
              className="p-0 border-0 text-decoration-none"
              aria-label="Menú de usuario"
            >
              <div className="topbar-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                <span className="small">FZ</span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="topbar-dropdown-menu border border-secondary shadow-lg rounded-3 py-2 mt-2">
              <div className="px-3 py-2 border-bottom border-secondary">
                <p className="user-name mb-0 fw-bold text-light">Usuario FORZA</p>
                <p className="user-email mb-0 text-secondary small">atleta@forza.app</p>
              </div>

              <div className="py-1">
                <Dropdown.Item as={Link} to="/perfil" className="dropdown-item-forza d-flex align-items-center px-3 py-2">
                  <UserIcon size={16} className="me-2" />
                  Mi Perfil
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item-forza px-3 py-2">
                  Progreso
                </Dropdown.Item>
              </div>

              <Dropdown.Divider className="border-secondary my-1" />

              <Dropdown.Item
                as="button"
                className="dropdown-item-forza text-danger px-3 py-2 w-100 text-start"
                onClick={onLogout}
              >
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
