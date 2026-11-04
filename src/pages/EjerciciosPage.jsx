import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Dropdown, Button } from 'react-bootstrap';
import { ejerciciosIniciales } from '../data/ejercicios';

/**
 * Página de Catálogo de Ejercicios adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Badge, Dropdown y Button de react-bootstrap.
 */
function EjerciciosPage() {
  const [filtroGrupo, setFiltroGrupo] = useState('Todos');

  // Filtrar ejercicios según el grupo muscular seleccionado
  const ejerciciosFiltrados = filtroGrupo === 'Todos'
    ? ejerciciosIniciales
    : ejerciciosIniciales.filter((e) => e.grupoMuscular.toLowerCase().includes(filtroGrupo.toLowerCase()));

  return (
    <Container className="py-2">
      {/* Encabezado y filtro con Dropdown de React Bootstrap */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold text-light mb-1">Biblioteca de Ejercicios</h1>
          <p className="text-secondary mb-0">
            Explora el catálogo clasificado por grupo muscular y nivel de dificultad.
          </p>
        </div>

        {/* Dropdown de React Bootstrap para filtrar */}
        <Dropdown>
          <Dropdown.Toggle className="forza-btn-outline btn-sm">
            Filtrar: {filtroGrupo}
          </Dropdown.Toggle>

          <Dropdown.Menu className="bg-dark border-secondary">
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Todos')}
              className="text-light"
            >
              Todos los grupos
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Pecho')}
              className="text-light"
            >
              Pecho
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Espalda')}
              className="text-light"
            >
              Espalda
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Piernas')}
              className="text-light"
            >
              Piernas
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Hombros')}
              className="text-light"
            >
              Hombros
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setFiltroGrupo('Core')}
              className="text-light"
            >
              Core / Abdomen
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Grid de ejercicios con Row y Col */}
      <Row className="g-4">
        {ejerciciosFiltrados.map((ejercicio) => (
          <Col md={6} lg={4} key={ejercicio.id}>
            <Card className="forza-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-2">{ejercicio.icono}</span>
                  <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
                </div>

                <Card.Title className="h5 fw-bold">{ejercicio.nombre}</Card.Title>
                <Card.Text className="small mb-3">
                  {ejercicio.descripcion}
                </Card.Text>

                <div className="border-top border-secondary pt-3 small text-secondary">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Dificultad:</span>
                    <strong className="text-light">{ejercicio.dificultad}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Series recomendadas:</span>
                    <strong className="text-light">{ejercicio.seriesRecomendadas}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Repeticiones:</span>
                    <strong className="text-light">{ejercicio.repeticionesRecomendadas}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="team-note mt-5">
        <strong>Nota para el equipo:</strong> Módulo de Ejercicios. El integrante a cargo puede conectar un buscador en tiempo real, modal para agregar ejercicios y conexión con la API en <code>src/services/api.js</code>.
      </div>
    </Container>
  );
}

export default EjerciciosPage;
