import { useState } from 'react';
import { Card, Badge, Button, Row, Col, Modal } from 'react-bootstrap';
import { HeartIcon } from '../layout/Icons';

/**
 * Mapeo de respaldo para imágenes en public/img/
 */
const IMAGENES_FALLBACK = {
  1: '/img/ejercicios/press-banca-fondo.webp',
  2: '/img/ejercicios/sentadilla-fondo.webp',
  3: '/img/ejercicios/dominadas-fondo.webp',
  4: '/img/ejercicios/press-militar-fondo.webp',
  5: '/img/ejercicios/peso-muerto-rumano-fondo.webp',
  6: '/img/ejercicios/plancha-abdominal-fondo.webp',
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
 * Card Premium de Ejercicio para FORZA.
 * Diseñada ~90% con componentes y utilidades nativas de React-Bootstrap
 * y ~10% de reglas CSS personalizadas en global.css (.ejercicio-card-premium, etc.)
 */
function EjercicioCard({ ejercicio, esFavorito, onToggleFavorito }) {
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Prioridad de resolución de imagen: imagenFondo -> IMAGENES_FALLBACK
  const imagenSrc = !imgError
    ? (ejercicio.imagenFondo || IMAGENES_FALLBACK[ejercicio.id])
    : IMAGENES_FALLBACK[ejercicio.id];

  const handleImgError = () => {
    if (!imgError) {
      setImgError(true);
    }
  };

  return (
    <>
      <Card className="ejercicio-card-premium h-100 d-flex flex-column shadow-sm">
        {/* Encabezado: Fotografía deportiva cinematográfica en primer plano con botón flotante */}
        <div className="ejercicio-card-img-container">
          <img
            src={imagenSrc}
            alt={ejercicio.nombre}
            className="ejercicio-card-img-hero"
            onError={handleImgError}
            loading="lazy"
          />
          {/* Degradado oscuro inferior para fusionar la foto con el cuerpo de la tarjeta */}
          <div className="ejercicio-card-dark-overlay" aria-hidden="true" />

          {/* Botón flotante de favoritos con efecto translúcido */}
          <button
            type="button"
            className={`ejercicio-card-heart-btn ${esFavorito ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorito(ejercicio.id);
            }}
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
              className={esFavorito ? 'text-danger' : 'text-white'}
            />
          </button>
        </div>

        {/* Cuerpo de la tarjeta */}
        <Card.Body className="p-4 d-flex flex-column flex-grow-1">
          {/* Badges de grupo muscular y dificultad */}
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
            {getBadgeDificultad(ejercicio.dificultad)}
          </div>

          {/* Título del ejercicio */}
          <Card.Title className="h5 fw-bold text-white mb-2">
            {ejercicio.nombre}
          </Card.Title>

          {/* Breve descripción limitada a 3 líneas */}
          <Card.Text
            className="small text-secondary mb-4 flex-grow-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {ejercicio.descripcion}
          </Card.Text>

          {/* Sección inferior: Cuadrícula de Series/Repeticiones y Botón de Acción */}
          <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
            <Row className="g-2 text-center mb-3">
              <Col xs={6}>
                <div className="ejercicio-metric-box">
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
                <div className="ejercicio-metric-box">
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

            {/* Botón principal llamativo color verde lima */}
            <Button
              className="forza-btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
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
          <Modal.Title className="h5 fw-bold">
            {ejercicio.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {/* Imagen ilustrativa en alta resolución */}
          {imagenSrc && (
            <div
              className="w-100 rounded-3 mb-4 overflow-hidden border border-secondary border-opacity-50"
              style={{
                height: '280px',
                backgroundColor: '#0a0d10',
              }}
            >
              <img
                src={imagenSrc}
                alt={`Demostración técnica de ${ejercicio.nombre}`}
                className="w-100 h-100 object-fit-cover"
                onError={handleImgError}
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
              <div className="ejercicio-metric-box">
                <small className="text-secondary d-block">Series</small>
                <strong className="text-light">{ejercicio.seriesRecomendadas}</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="ejercicio-metric-box">
                <small className="text-secondary d-block">Reps</small>
                <strong className="text-light">{ejercicio.repeticionesRecomendadas}</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="ejercicio-metric-box">
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
