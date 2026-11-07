import { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  ListGroup,
  Card,
} from 'react-bootstrap';
import { ejerciciosIniciales } from '../../data/ejercicios';

/**
 * Modal para seleccionar ejercicios del catálogo existente.
 * Utiliza 100% clases y componentes de React Bootstrap.
 */
function ModalAgregarEjercicio({ show, onClose, onAgregar, diaActual }) {
  const [busqueda, setBusqueda] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [series, setSeries] = useState('4');
  const [repeticiones, setRepeticiones] = useState('10');

  const ejerciciosFiltrados = ejerciciosIniciales.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.grupoMuscular.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionar = (ejercicio) => {
    setEjercicioSeleccionado(ejercicio);
    setSeries(String(ejercicio.seriesRecomendadas || 4));
    setRepeticiones(String(ejercicio.repeticionesRecomendadas || 10));
  };

  const handleConfirmar = () => {
    if (!ejercicioSeleccionado) return;

    const seriesNum = parseInt(series, 10);
    const repsStr = repeticiones.trim();

    if (!seriesNum || seriesNum <= 0 || !repsStr) {
      alert('Ingresá series y repeticiones válidas.');
      return;
    }

    onAgregar({
      ...ejercicioSeleccionado,
      series: seriesNum,
      repeticiones: repsStr,
    });

    handleClose();
  };

  const handleClose = () => {
    setBusqueda('');
    setEjercicioSeleccionado(null);
    setSeries('4');
    setRepeticiones('10');
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      contentClassName="bg-dark text-light border border-secondary"
    >
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title className="h5 fw-bold">
          Agregar ejercicio a <span style={{ color: 'var(--color-primary)' }}>{diaActual}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Buscador nativo con Form.Control de Bootstrap */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Buscar por nombre o grupo (ej: Pecho, Sentadilla)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-black text-light border-secondary"
          />
        </Form.Group>

        {/* Lista de ejercicios con ListGroup de Bootstrap */}
        <ListGroup className="border border-secondary rounded overflow-auto mb-3" style={{ maxHeight: '220px' }}>
          {ejerciciosFiltrados.map((ej) => {
            const activo = ejercicioSeleccionado?.id === ej.id;
            return (
              <ListGroup.Item
                key={ej.id}
                action
                onClick={() => handleSeleccionar(ej)}
                className={`d-flex justify-content-between align-items-center py-2 px-3 border-secondary ${
                  activo ? 'bg-black border-success' : 'bg-dark text-light'
                }`}
                style={activo ? { borderLeft: '4px solid var(--color-primary)' } : {}}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-5">{ej.icono}</span>
                  <div>
                    <div className="fw-semibold small text-light">{ej.nombre}</div>
                    <small className="text-secondary">{ej.grupoMuscular}</small>
                  </div>
                </div>
                <Badge bg="black" className="text-secondary border border-secondary small">
                  {ej.dificultad}
                </Badge>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        {/* Configuración de series y repeticiones dentro de Card Bootstrap */}
        {ejercicioSeleccionado && (
          <Card body className="bg-black border-secondary p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fs-5">{ejercicioSeleccionado.icono}</span>
              <strong className="text-light">{ejercicioSeleccionado.nombre}</strong>
            </div>
            <Row className="g-2">
              <Col xs={6}>
                <Form.Label className="text-secondary small mb-1">Series</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="bg-dark text-light border-secondary"
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="text-secondary small mb-1">Repeticiones</Form.Label>
                <Form.Control
                  type="text"
                  value={repeticiones}
                  onChange={(e) => setRepeticiones(e.target.value)}
                  className="bg-dark text-light border-secondary"
                />
              </Col>
            </Row>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer className="border-secondary">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          className="forza-btn-primary"
          onClick={handleConfirmar}
          disabled={!ejercicioSeleccionado}
        >
          Agregar al día
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAgregarEjercicio;
