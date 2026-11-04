import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

/**
 * Pantalla Principal (HomePage) adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Button, Badge, Alert y Modal de react-bootstrap.
 * Mantiene la animación con Framer Motion y la integración con SweetAlert2.
 */
function HomePage() {
  // Estado para controlar la visibilidad del Modal de React Bootstrap
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Alerta interactiva con SweetAlert2
  const mostrarSweetAlert = () => {
    Swal.fire({
      title: '¡FORZA + React Bootstrap!',
      text: 'React Bootstrap, SweetAlert2 y Framer Motion están funcionando en perfecta armonía.',
      icon: 'success',
      confirmButtonText: 'Genial',
      confirmButtonColor: '#ccff00',
      background: '#1b1e26',
      color: '#f8fafc',
    });
  };

  return (
    <Container>
      {/* Sección Hero con animación sutil de Framer Motion */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="hero-tag">ENTRENA SIN LÍMITES</span>
        <h1 className="hero-title">
          GESTIONÁ TUS RUTINAS CON <span>FORZA</span>
        </h1>
        <p className="hero-subtitle">
          Diseña entrenamientos personalizados, explora ejercicios por grupo muscular
          y lleva un registro claro de tu progreso en el gimnasio.
        </p>

        {/* Botones de acción utilizando el componente Button de React Bootstrap */}
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button as={Link} to="/ejercicios" className="forza-btn-primary">
            Explorar Ejercicios 🏋️
          </Button>
          <Button as={Link} to="/rutinas" className="forza-btn-secondary">
            Ver Rutinas
          </Button>
          <Button onClick={handleOpenModal} className="forza-btn-outline">
            Info Modal ℹ️
          </Button>
          <Button onClick={mostrarSweetAlert} className="forza-btn-secondary">
            Test SweetAlert2 🔔
          </Button>
        </div>
      </motion.section>

      {/* Alerta informativa de React Bootstrap */}
      <Alert className="forza-alert my-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span>
            💡 <strong>Tecnologías activas:</strong> React Bootstrap para la maquetación responsive y componentes interactivos, combinado con CSS personalizado para la identidad oscura y verde lima de FORZA.
          </span>
          <Badge className="forza-badge">V1.0 Activo</Badge>
        </div>
      </Alert>

      {/* Grid de módulos con Row, Col y Card de React Bootstrap */}
      <section className="mt-4">
        <h2 className="h4 fw-bold text-light mb-2">Módulos del Sistema</h2>
        <p className="text-secondary mb-4">
          Estructura distribuida para el trabajo en paralelo de los cuatro integrantes del equipo:
        </p>

        <Row className="g-4">
          <Col md={4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="forza-card">
                <Card.Body>
                  <div className="fs-1 mb-2">📋</div>
                  <Card.Title>Gestión de Rutinas</Card.Title>
                  <Card.Text>
                    Crea y organiza planes de entrenamiento semanales divididos por objetivos y días.
                  </Card.Text>
                  <Badge className="forza-badge">Módulo 1</Badge>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="forza-card">
                <Card.Body>
                  <div className="fs-1 mb-2">💪</div>
                  <Card.Title>Catálogo de Ejercicios</Card.Title>
                  <Card.Text>
                    Biblioteca de ejercicios con detalles técnicos, series, repeticiones y grupos musculares.
                  </Card.Text>
                  <Badge className="forza-badge">Módulo 2</Badge>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="forza-card">
                <Card.Body>
                  <div className="fs-1 mb-2">📊</div>
                  <Card.Title>Dashboard y Usuarios</Card.Title>
                  <Card.Text>
                    Panel de control con métricas del usuario, perfil personal y autenticación completa.
                  </Card.Text>
                  <Badge className="forza-badge">Módulos 3 y 4</Badge>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </section>

      {/* Modal de React Bootstrap */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered
        contentClassName="bg-dark text-light border border-secondary"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="text-light fw-bold">
            ⚡ Proyecto FORZA - Modal de Demostración
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-secondary">
            Este modal es un componente nativo de <strong>React Bootstrap</strong> (<code>&lt;Modal&gt;</code>) funcionando con estado de React (<code>useState</code>).
          </p>
          <ul className="text-secondary mb-0">
            <li>Estructura adaptada al diseño responsive.</li>
            <li>Colores oscuros con acento verde lima de FORZA.</li>
            <li>Listo para ser reutilizado en creación de rutinas y confirmaciones.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={handleCloseModal} className="forza-btn-secondary btn-sm">
            Cerrar
          </Button>
          <Button onClick={handleCloseModal} className="forza-btn-primary btn-sm">
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HomePage;
