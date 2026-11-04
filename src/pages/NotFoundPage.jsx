import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página 404 (No encontrada) adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col y Button de react-bootstrap.
 */
function NotFoundPage() {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div 
            className="fw-bold mb-2" 
            style={{ fontSize: '5.5rem', color: 'var(--color-primary)', lineHeight: 1 }}
          >
            404
          </div>
          <h1 className="h2 fw-bold text-light mb-3">Página no encontrada</h1>
          <p className="text-secondary mb-4">
            La ruta a la que estás intentando acceder no existe o fue reubicada dentro del sistema.
          </p>
          <Button as={Link} to="/" className="forza-btn-primary">
            ← Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundPage;
