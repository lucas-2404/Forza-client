import { Card, ProgressBar } from 'react-bootstrap';

/**
 * CalorieGoalCard — FORZA Nutrition 2.0
 * Panel compacto de balance calórico diario con indicador circular conic-gradient.
 *
 * Props:
 *  - consumidas (number): Calorías consumidas hasta el momento
 *  - meta       (number): Meta diaria fijada (ej. 2200 kcal)
 */
function CalorieGoalCard({ consumidas, meta }) {
  // Cálculo de porcentaje calórico (evita superar el 100% en la gráfica)
  const porcentaje = Math.min(100, Math.round((consumidas / meta) * 100));
  const restantes = Math.max(0, meta - consumidas);

  // Acento dinámico si alcanza la meta
  const colorProgreso = porcentaje >= 100 ? '#ff6b35' : 'var(--color-primary, #9EF01A)';

  // Gráfico circular estilizado con conic-gradient puro
  const estiloCirculo = {
    background: `conic-gradient(
      ${colorProgreso} ${porcentaje * 3.6}deg,
      var(--border-color, #2A3035) ${porcentaje * 3.6}deg
    )`,
  };

  return (
    <Card className="forza-card border-0 rounded-4 mb-4 shadow-sm">
      <Card.Body className="p-3 p-md-4 text-center">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h3 className="h6 text-white fw-bold mb-0">Meta calórica del día</h3>
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: 'rgba(158, 240, 26, 0.15)',
              color: 'var(--color-primary, #9EF01A)',
              fontSize: '0.72rem',
              padding: '0.35rem 0.6rem',
            }}
          >
            Objetivo: {meta} kcal
          </span>
        </div>

        {/* Indicador circular Donut */}
        <div className="calorie-circle mx-auto my-3" style={estiloCirculo} aria-hidden="true">
          <div className="calorie-circle__inner d-flex flex-column align-items-center justify-content-center">
            <span className="fs-3 fw-bold text-white lh-1">{consumidas}</span>
            <span className="text-secondary small mt-1" style={{ fontSize: '0.72rem' }}>
              kcal
            </span>
          </div>
        </div>

        {/* Resumen numérico en 3 columnas */}
        <div className="d-flex justify-content-around py-2 border-top border-bottom border-secondary border-opacity-50 my-3">
          <div className="text-center">
            <div className="fw-bold fs-5" style={{ color: 'var(--color-primary, #9EF01A)' }}>
              {porcentaje}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>Completado</div>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-5 text-white">{restantes}</div>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>kcal restantes</div>
          </div>
          <div className="text-center">
            <div className="fw-bold fs-5 text-white">{meta}</div>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>Meta diaria</div>
          </div>
        </div>

        {/* Barras de macronutrientes estimadas */}
        <div className="text-start mt-3">
          <div className="d-flex justify-content-between text-secondary small mb-1" style={{ fontSize: '0.75rem' }}>
            <span>Proteínas (132g / 150g)</span>
            <span className="text-light fw-semibold">88%</span>
          </div>
          <ProgressBar
            now={88}
            variant="success"
            className="mb-2"
            style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '3px' }}
          />

          <div className="d-flex justify-content-between text-secondary small mb-1" style={{ fontSize: '0.75rem' }}>
            <span>Carbohidratos (210g / 250g)</span>
            <span className="text-light fw-semibold">84%</span>
          </div>
          <ProgressBar
            now={84}
            variant="warning"
            className="mb-2"
            style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '3px' }}
          />

          <div className="d-flex justify-content-between text-secondary small mb-1" style={{ fontSize: '0.75rem' }}>
            <span>Grasas saludables (48g / 65g)</span>
            <span className="text-light fw-semibold">74%</span>
          </div>
          <ProgressBar
            now={74}
            variant="info"
            style={{ height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '3px' }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default CalorieGoalCard;
