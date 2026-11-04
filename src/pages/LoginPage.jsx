import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página de Inicio de Sesión (Login) adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Form (Form.Group, Form.Label, Form.Control) y Button.
 */
function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">🔐</div>
                <h1 className="h3 fw-bold text-light">Iniciar Sesión</h1>
                <p className="text-secondary small">
                  Ingresá tus credenciales para acceder a FORZA.
                </p>
              </div>

              {/* Formulario utilizando componentes Form de React Bootstrap */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="forza-form-label">Correo Electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="forza-form-control"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label className="forza-form-label">Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="••••••••" 
                    className="forza-form-control"
                    required
                  />
                </Form.Group>

                <Button type="submit" className="forza-btn-primary w-100">
                  Ingresar a la Plataforma
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-secondary small">¿No tenés cuenta? </span>
                <Link to="/registro" className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                  Registrate acá
                </Link>
              </div>

              <div className="team-note mt-4">
                <strong>Nota para el equipo:</strong> Módulo de Autenticación. El integrante asignado puede añadir validación de formulario y conexión con la API en <code>src/services/api.js</code>.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
