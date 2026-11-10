import { useState } from 'react';
import { Card, Badge, Button, Row, Col, Modal } from 'react-bootstrap';
import { HeartIcon } from '../layout/Icons';

/**
 * Mapeo de respaldo para imágenes en public/img/
 */
const IMAGENES_FALLBACK = {
  1: '/img/Press-Banca.jpg',
  2: '/img/Sentadilla.jpg',
  3: '/img/Dominadas-Pronales.jpg',
  4: '/img/Press-Militar-Mancuernas.jpg',
  5: '/img/Pm-Romano.jpg',
  6: '/img/Plancha-Abdominal.jpg',
};

/**
 * Helper para renderizar el badge de dificultad con color semántico de Bootstrap.
 */
function getBadgeDificultad(dificultad = '') {
  const norm = dificultad.toLowerCase();
  if (norm.includes('principiante')) {
    return (
      <Badge bg="success" className="bg-opacity-25 text-success border border-success border-opacity-50">
        Principiante
      </Badge>
    );
  }
  if (norm.includes('avanzado')) {
    return (
      <Badge bg="danger" className="bg-opacity-25 text-danger border border-danger border-opacity-50">
        Avanzado
      </Badge>
    );
  }
  return (
    <Badge bg="warning" className="bg-opacity-25 text-warning border border-warning border-opacity-50">
      Intermedio
    </Badge>
  );
}

/**
 * Card moderna de Ejercicio para FORZA.
 * Diseñada 90% con componentes y utilidades nativas de React-Bootstrap.
 */
function EjercicioCard({ ejercicio, esFavorito, onToggleFavorito }) {
  const [showModal, setShowModal] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);

  const imagenSrc = !errorImagen ? (ejercicio.imagen || IMAGENES_FALLBACK[ejercicio.id] || null) : null;

  return (
    <>
      <Card className="forza-card h-100 shadow-sm">
        <Card.Body className="d-flex flex-column p-4">
          {/* Fila superior: Contenedor de Icono + Botón de Favorito */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-50"
              style={{ width: '48px', height: '48px', fontSize: '1.7rem' }}
              aria-hidden="true"
            >
              {ejercicio.icono || '🏋️'}
            </div>

            <Button
              variant="link"
              className="p-0 border rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '38px',
                height: '38px',
                borderColor: esFavorito ? '#ff4d6d' : 'rgba(255, 255, 255, 0.15)',
                backgroundColor: esFavorito ? 'rgba(255, 77, 109, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => onToggleFavorito(ejercicio.id)}
              aria-pressed={esFavorito}
              aria-label={
                esFavorito
                  ? `Quitar ${ejercicio.nombre} de favoritos`
                  : `Agregar ${ejercicio.nombre} a favoritos`
              }
              title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <HeartIcon
                size={18}
                fill={esFavorito ? '#ff4d6d' : 'none'}
                className={esFavorito ? 'text-danger' : 'text-secondary'}
              />
            </Button>
          </div>

          {/* Badges de clasificación */}
          <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
            <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
            {getBadgeDificultad(ejercicio.dificultad)}
          </div>

          {/* Título y descripción */}
          <Card.Title className="h5 fw-bold text-light mb-2">
            {ejercicio.nombre}
          </Card.Title>
          <Card.Text className="small text-secondary mb-4 flex-grow-1">
            {ejercicio.descripcion}
          </Card.Text>

          {/* Sección inferior: Cuadrícula de Métricas (Series y Reps) */}
          <div className="mt-auto pt-3 border-top border-secondary border-opacity-50">
            <Row className="g-2 text-center mb-3">
              <Col xs={6}>
                <div className="p-2 rounded-2 bg-black bg-opacity-40 border border-secondary border-opacity-50">
                  <span
                    className="d-block text-secondary text-uppercase fw-semibold mb-1"
                    style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
                  >
                    Series
                  </span>
                  <span className="fw-bold text-light fs-6">
                    {ejercicio.seriesRecomendadas}
                  </span>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-2 rounded-2 bg-black bg-opacity-40 border border-secondary border-opacity-50">
                  <span
                    className="d-block text-secondary text-uppercase fw-semibold mb-1"
                    style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
                  >
                    Repeticiones
                  </span>
                  <span className="fw-bold text-light fs-6">
                    {ejercicio.repeticionesRecomendadas}
                  </span>
                </div>
              </Col>
            </Row>

            {/* Botón de acción interactivo */}
            <Button
              className="forza-btn-outline btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <span>Ver técnica y detalles</span>
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de Detalle y Técnica (React-Bootstrap) */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        contentClassName="bg-dark text-light border border-secondary shadow-lg"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary pb-3">
          <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2">
            <span aria-hidden="true">{ejercicio.icono || '🏋️'}</span>
            <span>{ejercicio.nombre}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {/* Imagen ilustrativa de la técnica: preserva aspecto original sin deformar ni estirar */}
          {imagenSrc && (
            <div
              className="w-100 rounded-3 mb-4 overflow-hidden d-flex align-items-center justify-content-center border border-secondary border-opacity-50"
              style={{
                height: '260px',
                backgroundColor: '#0a0d10',
                padding: '8px',
              }}
            >
              <img
                src={imagenSrc}
                alt={`Demostración técnica de ${ejercicio.nombre}`}
                className="rounded"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={() => setErrorImagen(true)}
              />
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
            {getBadgeDificultad(ejercicio.dificultad)}
            <Badge bg="secondary" className="bg-opacity-25 text-secondary border border-secondary">
              ID #{ejercicio.id}
            </Badge>
          </div>

          <h6 className="fw-bold text-light mb-1">Descripción:</h6>
          <p className="text-secondary small mb-4">{ejercicio.descripcion}</p>

          <h6 className="fw-bold text-light mb-2">Parámetros recomendados:</h6>
          <Row className="g-2 text-center mb-4">
            <Col xs={4}>
              <div className="p-2 rounded bg-black bg-opacity-50 border border-secondary">
                <small className="text-secondary d-block">Series</small>
                <strong className="text-light">{ejercicio.seriesRecomendadas}</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 rounded bg-black bg-opacity-50 border border-secondary">
                <small className="text-secondary d-block">Reps</small>
                <strong className="text-light">{ejercicio.repeticionesRecomendadas}</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 rounded bg-black bg-opacity-50 border border-secondary">
                <small className="text-secondary d-block">Descanso</small>
                <strong className="text-light">60-90 seg</strong>
              </div>
            </Col>
          </Row>

          <h6 className="fw-bold text-light mb-2">Consejos de ejecución y técnica:</h6>
          <ul className="text-secondary small ps-3 mb-0">
            <li className="mb-2">Controlá la fase excéntrica (bajada) en 2 a 3 segundos.</li>
            <li className="mb-2">Mantené la contracción isométrica durante 1 segundo en el punto máximo de tensión.</li>
            <li>Inhalá al descender y exhalá con fuerza al realizar el esfuerzo.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="border-secondary d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            className="d-flex align-items-center gap-2"
            onClick={() => onToggleFavorito(ejercicio.id)}
          >
            <HeartIcon size={16} fill={esFavorito ? '#ff4d6d' : 'none'} />
            <span>{esFavorito ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EjercicioCard;
