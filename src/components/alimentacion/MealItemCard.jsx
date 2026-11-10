import { Badge } from 'react-bootstrap';

/**
 * MealItemCard — FORZA Nutrition 2.0
 * Tarjeta horizontal premium para cada comida del plan diario.
 *
 * Props:
 *  - comida    (object): Datos de la comida (nombre, hora, calorias, macros, imagen, descripcion)
 *  - consumida (bool):   Si la comida fue registrada como consumida
 *  - onClick   (func):   Abre la Ficha Nutricional interactiva (Modal)
 */
function MealItemCard({ comida, consumida, onClick }) {
  return (
    <div
      className={`meal-item d-flex align-items-center gap-3 p-3 p-md-4 rounded-4 mb-3 ${
        consumida ? 'meal-item--consumida' : ''
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ver ficha nutricional de ${comida.nombre}`}
    >
      {/* Fotografía gastronómica de la comida */}
      <img
        src={comida.imagen}
        alt={comida.alt || comida.nombre}
        className="meal-img-thumb flex-shrink-0"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
      {/* Respaldo accesible en caso de que la imagen tarde en responder */}
      <div
        className="meal-img-thumb flex-shrink-0 d-none align-items-center justify-content-center"
        style={{ backgroundColor: 'var(--bg-card-hover)', fontSize: '2rem' }}
        aria-hidden="true"
      >
        🥗
      </div>

      {/* Información detallada de la comida */}
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-white fs-5">{comida.nombre}</span>
            {consumida ? (
              <Badge
                className="rounded-pill px-3 py-1 fw-bold"
                style={{
                  backgroundColor: 'var(--color-primary, #9EF01A)',
                  color: '#080B0D',
                  fontSize: '0.72rem',
                }}
              >
                ✓ Consumida
              </Badge>
            ) : (
              <Badge
                className="rounded-pill px-3 py-1 bg-dark border border-secondary text-secondary"
                style={{ fontSize: '0.72rem' }}
              >
                Pendiente
              </Badge>
            )}
          </div>

          {/* Horario y calorías */}
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark border border-secondary text-secondary small py-1 px-2">
              🕐 {comida.hora}
            </span>
            <span
              className="fw-bold px-2 py-1 rounded-2"
              style={{
                backgroundColor: 'rgba(158, 240, 26, 0.1)',
                color: 'var(--color-primary, #9EF01A)',
                fontSize: '0.85rem',
              }}
            >
              🔥 {comida.calorias} kcal
            </span>
          </div>
        </div>

        <p className="text-secondary small mb-2 text-truncate" style={{ maxWidth: '480px' }}>
          {comida.descripcion}
        </p>

        {/* Desglose de macronutrientes esenciales */}
        {comida.macros && (
          <div className="d-flex flex-wrap gap-2 text-secondary small" style={{ fontSize: '0.78rem' }}>
            <span className="text-light">
              <strong className="text-secondary">Proteínas:</strong> {comida.macros.proteinas}g
            </span>
            <span className="text-secondary">•</span>
            <span className="text-light">
              <strong className="text-secondary">Carbos:</strong> {comida.macros.carbos}g
            </span>
            <span className="text-secondary">•</span>
            <span className="text-light">
              <strong className="text-secondary">Grasas:</strong> {comida.macros.grasas}g
            </span>
          </div>
        )}
      </div>

      {/* Indicador de chevron */}
      <span
        className="text-secondary fs-4 pe-1 flex-shrink-0 d-none d-sm-inline"
        aria-hidden="true"
        style={{ color: 'var(--text-secondary)' }}
      >
        ›
      </span>
    </div>
  );
}

export default MealItemCard;
