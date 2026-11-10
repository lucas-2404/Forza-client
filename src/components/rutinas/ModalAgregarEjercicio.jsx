import { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Card,
} from 'react-bootstrap';
import { ejerciciosIniciales } from '../../data/ejercicios';
import { obtenerImagenEjercicio } from '../../services/rutinasService';
import { SearchIcon, DumbbellIcon } from '../layout/Icons';

/**
 * ModalAgregarEjercicio.jsx
 * Modal para seleccionar ejercicios del catálogo.
 * Utiliza 90% React Bootstrap y fotografía de ejercicios sin emojis.
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
      contentClassName="bg-dark text-light border border-secondary shadow-lg"
    >
      <Modal.Header closeButton closeVariant="white" className="border-secondary pb-3">
        <Modal.Title className="h5 fw-bold">
          Agregar ejercicio a <span style={{ color: 'var(--color-primary)' }}>{diaActual}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Buscador nativo con Form.Control */}
        <div className="position-relative mb-3">
          <Form.Control
            type="search"
            placeholder="Buscar ejercicio por nombre o grupo (ej: Pecho, Sentadilla)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-black text-light border-secondary ps-4"
          />
        </div>

        {/* Lista de ejercicios del catálogo */}
        <ListGroup
          className="border border-secondary rounded overflow-auto mb-3"
          style={{ maxHeight: '240px' }}
        >
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
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-2 overflow-hidden border border-secondary flex-shrink-0"
                    style={{ width: '44px', height: '44px', backgroundColor: '#080B0D' }}
                  >
                    <img
                      src={ej.imagenFondo || ej.imagen || obtenerImagenEjercicio(ej)}
                      alt={ej.nombre}
                      loading="lazy"
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="fw-semibold small text-light">{ej.nombre}</div>
                    <small className="text-secondary">{ej.grupoMuscular}</small>
                  </div>
                </div>
                <span className="rutina-muscle-badge">
                  {ej.dificultad}
                </span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        {/* Configuración de series y repeticiones */}
        {ejercicioSeleccionado && (
          <Card body className="bg-black border-secondary p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <DumbbellIcon size={18} className="text-success" />
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
          className="forza-btn-primary fw-bold"
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
