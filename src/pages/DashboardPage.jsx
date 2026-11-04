import { Container, Row, Col, Card, Badge, ProgressBar, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Página del Panel de Control (Dashboard) adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Badge, ProgressBar, Button y Alert.
 */
function DashboardPage() {
  return (
    <Container className="py-2">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold text-light mb-1">📊 Panel de Control</h1>
          <p className="text-secondary mb-0">Bienvenido de nuevo, resumen de tu actividad deportiva.</p>
        </div>
        <Button as={Link} to="/rutinas" className="forza-btn-primary btn-sm">
          + Nueva Rutina
        </Button>
      </div>

      <Alert className="forza-alert mb-4">
        <strong>¡Buen trabajo esta semana!</strong> Has completado 3 de 4 sesiones planificadas.
      </Alert>

      {/* Tarjetas de estadísticas con Row y Col */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="forza-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Rutinas Creadas</span>
                <Badge className="forza-badge">Activas</Badge>
              </div>
              <h2 className="display-6 fw-bold" style={{ color: 'var(--color-primary)' }}>3</h2>
              <p className="text-secondary small mb-0">Hipertrofia, Fuerza y Definición</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="forza-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Frecuencia Semanal</span>
                <Badge className="forza-badge">Objetivo</Badge>
              </div>
              <h2 className="display-6 fw-bold" style={{ color: 'var(--color-primary)' }}>4 días</h2>
              <p className="text-secondary small mb-0">Lunes, Martes, Jueves y Viernes</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="forza-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-bold text-uppercase">Constancia Mensual</span>
                <Badge className="forza-badge">85%</Badge>
              </div>
              <h2 className="display-6 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>85%</h2>
              <ProgressBar 
                now={85} 
                style={{ height: '8px', backgroundColor: 'var(--bg-surface)' }}
                variant="success"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="team-note">
        <strong>Nota para el equipo:</strong> Módulo de Dashboard. Aquí se integrarán los componentes del panel, gráficas de rendimiento y acceso rápido a rutinas activas.
      </div>
    </Container>
  );
}

export default DashboardPage;
