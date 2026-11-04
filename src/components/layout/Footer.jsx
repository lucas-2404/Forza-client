import { Container, Row, Col } from 'react-bootstrap';

/**
 * Componente Footer adaptado con React Bootstrap.
 * Utiliza Container, Row y Col para estructurar el pie de página de forma responsive.
 */
function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="forza-footer">
      <Container>
        <Row className="gy-3 align-items-center">
          <Col md={6}>
            <div className="footer-brand mb-1">
              FORZA <span>GYM APP</span>
            </div>
            <p className="mb-0 text-secondary">
              Tu plataforma para planificar, registrar y dominar tus entrenamientos.
            </p>
          </Col>

          <Col md={6} className="text-md-end">
            <p className="mb-1 text-light">
              <strong>Proyecto Integrador</strong> — Desarrollo Frontend
            </p>
            <p className="mb-0 text-secondary">
              Construido con React, React Bootstrap y CSS personalizado.
            </p>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p className="mb-0">
            &copy; {anioActual} FORZA. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
