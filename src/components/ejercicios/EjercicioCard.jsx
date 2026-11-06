import { Card, Badge, Button } from 'react-bootstrap';

/**
 * Card de un ejercicio con botón para marcarlo como favorito.
 * Mantiene las clases del equipo: forza-card y forza-badge.
 */
function EjercicioCard({ ejercicio, esFavorito, onToggleFavorito }) {
    return (
        <Card className="forza-card h-100">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-2" aria-hidden="true">{ejercicio.icono}</span>
                    <div className="d-flex align-items-center gap-2">
                        <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
                        <Button
                            variant="link"
                            className="p-0 fs-4 text-decoration-none lh-1"
                            style={{ color: esFavorito ? '#ff4d6d' : '#8a8a8a' }}
                            onClick={() => onToggleFavorito(ejercicio.id)}
                            aria-pressed={esFavorito}
                            aria-label={
                                esFavorito
                                    ? `Quitar ${ejercicio.nombre} de favoritos`
                                    : `Agregar ${ejercicio.nombre} a favoritos`
                            }
                            title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            {esFavorito ? '♥' : '♡'}
                        </Button>
                    </div>
                </div>

                <Card.Title className="h5 fw-bold">{ejercicio.nombre}</Card.Title>
                <Card.Text className="small mb-3">{ejercicio.descripcion}</Card.Text>

                <div className="border-top border-secondary pt-3 small text-secondary mt-auto">
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
    );
}

export default EjercicioCard;