import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Componente Footer adaptado al Diseño B de FORZA.
 *
 * Refactorizado al 90 % Bootstrap:
 * - Borde y espaciado con `border-top border-secondary py-3 mt-auto`.
 * - Responsive fluido con `Container fluid px-3 px-lg-4`.
 * - Alineación adaptable con `text-center text-md-start` y `text-center text-md-end`.
 * - Enlaces flexibles con `d-inline-flex flex-wrap gap-2 gap-md-3`.
 */
function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="forza-layout-footer border-top border-secondary py-3 mt-auto" aria-label="Pie de página">
      <Container fluid className="px-3 px-lg-4">
        <Row className="gy-2 align-items-center">
          <Col md={6} className="text-center text-md-start">
            <span className="fw-bold text-light me-2">FORZA</span>
            <span className="text-secondary small">
              Plataforma integral para gestión y optimización de entrenamientos.
            </span>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <div className="d-inline-flex flex-wrap justify-content-center justify-content-md-end gap-2 gap-md-3 small text-secondary">
              <Link to="/" className="text-secondary text-decoration-none">Inicio</Link>
              <span>•</span>
              <Link to="/ejercicios" className="text-secondary text-decoration-none">Ejercicios</Link>
              <span>•</span>
              <Link to="/rutinas" className="text-secondary text-decoration-none">Rutinas</Link>
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
