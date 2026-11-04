import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';

/**
 * Página de Perfil de Usuario adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Button, Badge y Spinner de react-bootstrap.
 */
function PerfilPage() {
  const [guardando, setGuardando] = useState(false);

  const handleSimularGuardado = () => {
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
    }, 1200);
  };

  return (
    <Container className="py-2">
      <Row className="justify-content-center">
        <Col md={10} lg={7}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'var(--color-primary-dark)',
                    border: '2px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    fontSize: '2.5rem',
                  }}
                >
                  👤
                </div>
                <h1 className="h3 fw-bold text-light mb-1">Mi Perfil</h1>
                <p className="text-secondary small mb-2">Gestioná tus datos personales y preferencias de entrenamiento.</p>
                <Badge className="forza-badge">Miembro Activo</Badge>
              </div>

              <div className="border-top border-secondary pt-3 d-flex flex-column gap-3">
                <div>
                  <span className="text-secondary small d-block">Nombre de Usuario</span>
                  <strong className="text-light">Usuario Demo</strong>
                </div>

                <div>
                  <span className="text-secondary small d-block">Correo Electrónico</span>
                  <strong className="text-light">demo@forza.app</strong>
                </div>

                <div>
                  <span className="text-secondary small d-block">Nivel de Experiencia</span>
                  <strong className="text-light">Intermedio (2 años de entrenamiento)</strong>
                </div>

                <div>
                  <span className="text-secondary small d-block">Objetivo Principal</span>
                  <strong className="text-light">Hipertrofia muscular y fuerza</strong>
                </div>
              </div>

              {/* Botón con Spinner de React Bootstrap para indicar acción */}
              <div className="mt-4 pt-2">
                <Button 
                  onClick={handleSimularGuardado} 
                  className="forza-btn-primary w-100 d-flex align-items-center justify-content-center"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <Spinner 
                        as="span" 
                        animation="border" 
                        size="sm" 
                        role="status" 
                        aria-hidden="true" 
                        className="me-2" 
                      />
                      Guardando cambios...
                    </>
                  ) : (
                    'Actualizar Perfil'
                  )}
                </Button>
              </div>

              <div className="team-note mt-4">
                <strong>Nota para el equipo:</strong> Módulo de Perfil de Usuario. Aquí se podrán editar los campos, cambiar la foto de perfil y consultar el historial.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PerfilPage;
