import { Card, ProgressBar } from 'react-bootstrap';

/**
 * NutritionStatCard — FORZA Nutrition 2.0
 * Tarjeta de estadística nutricional con fotografía gastronómica en lugar de emojis.
 *
 * Props:
 *  - nombre    (string): Nombre de la métrica (ej. "Proteínas", "Hidratación")
 *  - consumido (number): Cantidad consumida actualmente
 *  - objetivo  (number): Meta diaria recomendada
 *  - unidad    (string): Unidad de medida ("kcal", "g", "L")
 *  - imagen    (string): Ruta de la fotografía profesional en public/img/alimentacion/
 *  - alt       (string): Texto alternativo accesible para la imagen
 */
function NutritionStatCard({ nombre, consumido, objetivo, unidad, imagen, alt }) {
  // Cálculo de porcentaje limitando la barra visual al 100%
  const porcentaje = Math.min(100, Math.round((Number(consumido) / Number(objetivo)) * 100));

  // Formato visual unificado: para litros mostramos 2 decimales coherentes con el tracker
  const valorFormateado =
    unidad === 'L' ? Number(consumido).toFixed(2) : Math.round(Number(consumido));

  const objetivoFormateado =
    unidad === 'L' ? Number(objetivo).toFixed(2) : objetivo;

  // Variante dinámica de color para la barra de progreso
  const colorBarra = porcentaje >= 90 ? 'success' : porcentaje >= 60 ? 'warning' : 'info';

  return (
    <Card className="nutrition-stat-card h-100 rounded-4 text-white shadow-sm border-0">
      <Card.Body className="p-3 p-md-4 d-flex flex-column justify-content-between">
        {/* Cabecera: Fotografía a la izquierda + Nombre y Valores + Porcentaje a la derecha */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-3 min-w-0">
            {/* Fotografía profesional cuadrada con esquinas redondeadas */}
            <img
              src={imagen}
              alt={alt || nombre}
              className="nutrition-stat-thumb flex-shrink-0"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            <div className="min-w-0">
              <span
                className="text-secondary small fw-semibold d-block text-uppercase text-truncate"
                style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
              >
                {nombre}
              </span>
              <div className="d-flex align-items-baseline gap-1 flex-wrap">
                <span className="fw-bold fs-4 text-white lh-1">{valorFormateado}</span>
                <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                  / {objetivoFormateado} {unidad}
                </span>
              </div>
            </div>
          </div>

          {/* Porcentaje en píldora verde lima */}
          <span
            className="badge rounded-pill fw-bold flex-shrink-0"
            style={{
              backgroundColor: 'rgba(158, 240, 26, 0.15)',
              color: 'var(--color-primary, #9EF01A)',
              border: '1px solid rgba(158, 240, 26, 0.35)',
              fontSize: '0.82rem',
              padding: '0.35rem 0.65rem',
            }}
          >
            {porcentaje}%
          </span>
        </div>

        {/* Barra de progreso de Bootstrap */}
        <div>
          <ProgressBar
            now={porcentaje}
            variant={colorBarra}
            style={{
              height: '6px',
              backgroundColor: 'var(--border-color, #2A3035)',
              borderRadius: '3px',
            }}
            aria-label={`${nombre}: ${porcentaje}% completado`}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default NutritionStatCard;
