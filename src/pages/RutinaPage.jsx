import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Offcanvas } from 'react-bootstrap';

/**
 * Página de Rutinas adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Badge, Button y Offcanvas de react-bootstrap.
 */
function RutinaPage() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  return (
    <Container className="py-2">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-light mb-1">🏋️‍♂️ Gestión de Rutinas</h1>
          <p className="text-secondary mb-0">
            Diseña, organiza y consulta planes de entrenamiento personalizados.
          </p>
        </div>

        {/* Botón que despliega el panel lateral Offcanvas de React Bootstrap */}
        <Button 
          onClick={() => setShowOffcanvas(true)} 
          className="forza-btn-outline btn-sm"
        >
          Guía de Rutinas (Offcanvas) 📖
        </Button>
      </div>

      {/* Grid de Rutinas de Ejemplo */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="forza-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge className="forza-badge">4 Días / Semana</Badge>
                <span className="text-secondary small">Intermedio</span>
              </div>
              <Card.Title className="h5 fw-bold mt-2">Torso / Pierna (Hipertrofia)</Card.Title>
              <Card.Text>
                Distribución equilibrada para entrenar dos veces por semana tren superior y dos veces tren inferior con días de descanso intermedios.
              </Card.Text>
              <div className="d-flex gap-2 mt-3">
                <Button className="forza-btn-primary btn-sm">Ver Ejercicios</Button>
                <Button className="forza-btn-secondary btn-sm">Editar</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="forza-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge className="forza-badge">3 Días / Semana</Badge>
                <span className="text-secondary small">Todos los niveles</span>
              </div>
              <Card.Title className="h5 fw-bold mt-2">Push / Pull / Legs (PPL)</Card.Title>
              <Card.Text>
                División basada en patrones biomecánicos: día de empuje (pecho/tríceps), día de tracción (espalda/bíceps) y día de piernas/core.
              </Card.Text>
              <div className="d-flex gap-2 mt-3">
                <Button className="forza-btn-primary btn-sm">Ver Ejercicios</Button>
                <Button className="forza-btn-secondary btn-sm">Editar</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="team-note">
        <strong>Nota para el equipo:</strong> Módulo de Rutinas. El integrante a cargo desarrollará el formulario para crear nuevas rutinas y asociar los ejercicios del catálogo.
      </div>

      {/* Panel lateral Offcanvas de React Bootstrap */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)} 
        placement="end"
        className="bg-dark text-light border-start border-secondary"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-bold" style={{ color: 'var(--color-primary)' }}>
            ⚡ Guía Rápida de Rutinas
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p className="text-secondary">
            Este panel lateral es el componente <code>&lt;Offcanvas&gt;</code> de <strong>React Bootstrap</strong>.
          </p>
          <h6 className="fw-bold text-light mt-4">Principios de entrenamiento:</h6>
          <ul className="text-secondary small ps-3">
            <li className="mb-2"><strong>Sobrecarga progresiva:</strong> Aumentar gradualmente el peso o las repeticiones.</li>
            <li className="mb-2"><strong>Frecuencia adecuada:</strong> Entrenar cada grupo muscular 2 veces por semana.</li>
            <li className="mb-2"><strong>Recuperación:</strong> Descansar entre 48 y 72 horas antes de volver a estimular el mismo grupo.</li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default RutinaPage;
