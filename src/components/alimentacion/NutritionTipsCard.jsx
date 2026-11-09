import { Card } from 'react-bootstrap';

/**
 * NutritionTipsCard — FORZA Nutrition 2.0
 * Pautas y consejos nutricionales orientados al rendimiento físico.
 *
 * Props:
 *  - tips (string[]): Colección de recomendaciones nutricionales
 */
function NutritionTipsCard({ tips }) {
  return (
    <Card className="forza-card border-0 rounded-4 shadow-sm">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="fs-5" aria-hidden="true">💡</span>
          <div>
            <h3 className="h6 text-white fw-bold mb-0">Tips Nutricionales</h3>
            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
              Pautas para potenciar tu recuperación
            </span>
          </div>
        </div>

        <ul className="list-unstyled m-0 d-flex flex-column gap-2">
          {tips.map((tip, indice) => (
            <li
              key={indice}
              className="d-flex align-items-start gap-2 p-2 rounded-3"
              style={{
                backgroundColor: 'var(--bg-sidebar, #0D1114)',
                border: '1px solid var(--border-color, #2A3035)',
              }}
            >
              {/* Checkmark verde estilizado */}
              <span
                className="flex-shrink-0 mt-1 d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'rgba(158, 240, 26, 0.15)',
                  color: 'var(--color-primary, #9EF01A)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="text-secondary small" style={{ lineHeight: '1.4' }}>
                {tip}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-2 border-top border-secondary border-opacity-50 text-center">
          <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
            Información de orientación general para entrenamientos de fuerza.
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NutritionTipsCard;
