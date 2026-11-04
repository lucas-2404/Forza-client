import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Componente Footer adaptado al Diseño B de FORZA.
 * Es sobrio, discreto y se ubica al pie del contenido principal sin competir con el Sidebar.
 */
function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="forza-layout-footer" aria-label="Pie de página">
      <Container fluid className="px-4">
        <Row className="gy-2 align-items-center">
          <Col md={6} className="text-center text-md-start">
            <span className="fw-bold text-light me-2">FORZA</span>
            <span className="text-secondary small">
              Plataforma integral para gestión y optimización de entrenamientos.
            </span>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <div className="d-inline-flex gap-3 small text-secondary">
              <Link to="/" className="text-secondary">Inicio</Link>
              <span>•</span>
              <Link to="/ejercicios" className="text-secondary">Ejercicios</Link>
              <span>•</span>
              <Link to="/rutinas" className="text-secondary">Rutinas</Link>
              <span>•</span>
              <span>&copy; {anioActual} FORZA</span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
