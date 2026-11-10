import { Card, Badge, Button } from 'react-bootstrap';
import { obtenerImagenRutina } from '../../services/rutinasService';
import { ZapIcon, TrashIcon, CheckIcon, CalendarIcon, TimerIcon, DumbbellIcon } from '../layout/Icons';

/**
 * RutinaCard.jsx — Tarjeta de Rutina Personalizada (Diseño Premium FORZA).
 * 90% React Bootstrap + 10% CSS en global.css.
 * Sin emojis en controles ni estadísticas.
 */

const ETIQUETAS_DIAS = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
  domingo: 'Dom',
};

function getBadgeNivel(nivel = '') {
  const norm = nivel.toLowerCase();
  if (norm.includes('avanzado')) {
    return (
      <span className="rutina-card-badge-dificultad bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
        Avanzado
      </span>
    );
  }
  if (norm.includes('intermedio')) {
    return (
      <span className="rutina-card-badge-dificultad bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
        Intermedio
      </span>
    );
  }
  return (
    <span className="rutina-card-badge-dificultad bg-primary bg-opacity-25 text-info border border-info border-opacity-50">
      Principiante
    </span>
  );
}

function RutinaCard({ rutina, onAbrir, onEliminar, onCompletar }) {
  const imagenRutina = rutina.imagen || obtenerImagenRutina(rutina);

  const totalEjercicios = rutina.dias
    ? Object.values(rutina.dias).reduce((acc, lista) => acc + (lista?.length || 0), 0)
    : 0;

  const grupos = rutina.grupos && rutina.grupos.length > 0
    ? rutina.grupos
    : Object.values(rutina.dias || {})
        .flat()
        .map((e) => e?.grupoMuscular)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);

  return (
    <Card className="rutina-card h-100 d-flex flex-column shadow-sm">
      {/* Cabecera con fotografía protagonista y degradado */}
      <div className="rutina-card-img-header">
        {imagenRutina && (
          <img
            src={imagenRutina}
            alt={rutina.nombre}
            loading="lazy"
            className="rutina-card-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="rutina-card-gradient" />

        {/* Badge de nivel */}
        {getBadgeNivel(rutina.nivel)}

        {/* Icono decorativo de energía */}
        <div className="rutina-card-icon-pill" title="Programa activo">
          <ZapIcon size={16} />
        </div>

        {/* Título y subtítulo integrados sobre el degradado inferior */}
        <div className="rutina-card-title-container">
          <h5 className="fw-bold text-white mb-1 lh-sm">
            {rutina.nombre}
          </h5>
          <small className="text-secondary d-block">
            {rutina.objetivo || 'Entrenamiento general'}
          </small>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <Card.Body className="d-flex flex-column p-3 flex-grow-1">
        {/* Grupos musculares */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {grupos.slice(0, 3).map((g) => (
            <span key={g} className="rutina-muscle-badge">
              {g}
            </span>
          ))}
          {grupos.length > 3 && (
            <span className="rutina-muscle-badge">
              +{grupos.length - 3}
            </span>
          )}
        </div>

        {/* Métricas con iconos SVG limpios */}
        <div className="d-flex justify-content-between align-items-center text-secondary small mb-3">
          <span className="d-flex align-items-center gap-1">
            <CalendarIcon size={14} className="text-secondary" />
            <span>{rutina.diasSeleccionados?.length || 0} días/sem</span>
          </span>
          <span className="d-flex align-items-center gap-1">
            <TimerIcon size={14} className="text-secondary" />
            <span>{rutina.duracionMin || 45} min</span>
          </span>
          <span className="d-flex align-items-center gap-1">
            <DumbbellIcon size={14} className="text-secondary" />
            <span>{totalEjercicios} ejercicios</span>
          </span>
        </div>

        {/* Badges de días de la semana */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {(rutina.diasSeleccionados || []).map((dia) => (
            <span key={dia} className="rutina-day-badge">
              {ETIQUETAS_DIAS[dia] || dia}
            </span>
          ))}
        </div>

        {/* Botones de acción inferiores */}
        <div className="mt-auto d-flex flex-column gap-2 pt-2 border-top border-secondary border-opacity-25">
          <div className="d-flex gap-2">
            <Button
              className="forza-btn-primary flex-fill btn-sm fw-bold"
              onClick={() => onAbrir(rutina)}
            >
              Ver detalle →
            </Button>
            <button
              type="button"
              className="rutina-btn-delete"
              onClick={() => onEliminar(rutina.id)}
              title="Eliminar rutina"
              aria-label="Eliminar rutina"
            >
              <TrashIcon size={16} />
            </button>
          </div>
          <button
            type="button"
            className="rutina-btn-complete w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => onCompletar(rutina)}
          >
            <CheckIcon size={16} className="text-success" />
            <span>Marcar sesión completada</span>
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RutinaCard;
