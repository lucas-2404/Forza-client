import { Card, Badge, Button } from 'react-bootstrap';

/**
 * Tarjeta individual de Rutina (Diseño A).
 * Construida con 90% componentes y utilidades nativas de Bootstrap.
 */
function RutinaCard({ rutina, onAbrir, onEliminar, onCompletar }) {
  const etiquetasDias = {
    lunes: 'Lun',
    martes: 'Mar',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    sabado: 'Sáb',
    domingo: 'Dom',
  };

  const totalEjercicios = rutina.dias
    ? Object.values(rutina.dias).reduce((acc, lista) => acc + lista.length, 0)
    : 0;

  return (
    <Card className="forza-card h-100 overflow-hidden border-secondary">
      {/* Contenedor de imagen / placeholder deportivo con utilidades Bootstrap */}
      <div 
        className="d-flex align-items-center justify-content-center position-relative overflow-hidden" 
        style={{ height: '140px', background: 'linear-gradient(135deg, #0D1114 0%, #151d08 100%)' }}
      >
        <span className="display-4 opacity-50">🏋️‍♂️</span>
        <div 
          className="position-absolute bottom-0 start-0 w-100 p-2" 
          style={{ background: 'linear-gradient(to top, rgba(23, 28, 32, 0.95), transparent)' }}
        />
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title className="h5 fw-bold text-light mb-0">{rutina.nombre}</Card.Title>
          <span className="badge bg-dark text-secondary border border-secondary small">
            {totalEjercicios} ej.
          </span>
        </div>

        <p className="text-secondary small mb-3">{rutina.objetivo}</p>

        {/* Días con Badges de Bootstrap */}
        {rutina.diasSeleccionados && rutina.diasSeleccionados.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {rutina.diasSeleccionados.map((dia) => (
              <Badge 
                key={dia} 
                bg="dark" 
                className="text-uppercase border px-2 py-1 fw-semibold"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                {etiquetasDias[dia] || dia}
              </Badge>
            ))}
          </div>
        )}

        {/* Botones de acción alineados con Bootstrap Flexbox */}
        <div className="mt-auto pt-2 d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <Button
              className="forza-btn-primary flex-fill btn-sm"
              onClick={() => onAbrir(rutina)}
            >
              Ver rutina →
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="px-2"
              onClick={() => onEliminar(rutina.id)}
              title="Eliminar rutina"
            >
              🗑️
            </Button>
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-100 text-light border-secondary"
            onClick={() => onCompletar(rutina)}
          >
            ✅ Marcar completado
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RutinaCard;
