import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página de Registro de Usuario adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Form (Form.Group, Form.Label, Form.Control) y Button.
 */
function RegisterPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">⚡</div>
                <h1 className="h3 fw-bold text-light">Crear Cuenta</h1>
                <p className="text-secondary small">
                  Unite a FORZA y comenzá a organizar tus rutinas de entrenamiento.
                </p>
              </div>

              {/* Formulario con React Bootstrap */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerNombre">
                  <Form.Label className="forza-form-label">Nombre Completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ej. Juan Pérez" 
                    className="forza-form-control"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label className="forza-form-label">Correo Electrónico</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="forza-form-control"
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="registerPassword">
                      <Form.Label className="forza-form-label">Contraseña</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Mínimo 6 caracteres" 
                        className="forza-form-control"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="registerPasswordConfirm">
                      <Form.Label className="forza-form-label">Confirmar Contraseña</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Repite la contraseña" 
                        className="forza-form-control"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" className="forza-btn-primary w-100 mt-2">
                  Crear mi Cuenta
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-secondary small">¿Ya tenés una cuenta? </span>
                <Link to="/login" className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                  Iniciá sesión acá
                </Link>
              </div>

              <div className="team-note mt-4">
                <strong>Nota para el equipo:</strong> Módulo de Registro. Aquí se validarán contraseñas coincidentes y se enviará la petición POST a la API.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
