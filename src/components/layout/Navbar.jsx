import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

/**
 * Componente Navbar adaptado con React Bootstrap.
 * Utiliza los componentes Navbar, Nav, Container y Button de react-bootstrap.
 */
function CustomNavbar() {
  return (
    <Navbar expand="lg" variant="dark" className="forza-navbar sticky-top">
      <Container>
        {/* Marca / Logotipo FORZA */}
        <Navbar.Brand as={Link} to="/" className="forza-brand">
          FORZA <span>⚡</span>
        </Navbar.Brand>

        {/* Botón hamburguesa responsive para celulares */}
        <Navbar.Toggle aria-controls="forza-navbar-nav" />

        {/* Menú colapsable */}
        <Navbar.Collapse id="forza-navbar-nav">
          <Nav className="mx-auto my-2 my-lg-0 gap-1">
            <Nav.Link as={NavLink} to="/" end className="forza-nav-link">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ejercicios" className="forza-nav-link">
              Ejercicios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/rutinas" className="forza-nav-link">
              Rutinas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard" className="forza-nav-link">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/perfil" className="forza-nav-link">
              Mi Perfil
            </Nav.Link>
          </Nav>

          {/* Botones de acción (Login y Registro) */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Button as={Link} to="/login" className="forza-btn-secondary btn-sm">
              Ingresar
            </Button>
            <Button as={Link} to="/registro" className="forza-btn-primary btn-sm">
              Registrarse
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
