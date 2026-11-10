import { Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { obtenerImagenRutina } from '../../services/rutinasService';

/**
 * RutinaCard.jsx — Tarjeta mejorada de rutina (Rediseño Diseño A).
 * Muestra imagen/gradiente, grupos musculares, nivel, días y progreso.
 */

// Gradientes y colores por objetivo
const TEMAS = {
  'Ganar masa muscular': {
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 60%, #0a1628 100%)',
    accent: '#7c3aed',
    emoji: '💪',
  },
  'Ganar fuerza': {
    gradient: 'linear-gradient(135deg, #1a0800 0%, #2a1200 60%, #140800 100%)',
    accent: '#ea580c',
    emoji: '🏋️‍♂️',
  },
  'Mejorar resistencia': {
    gradient: 'linear-gradient(135deg, #001a2e 0%, #002744 60%, #001520 100%)',
    accent: '#0ea5e9',
    emoji: '🏃‍♂️',
  },
  'Acondicionamiento general': {
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #0d2010 60%, #081508 100%)',
    accent: '#9EF01A',
    emoji: '⚡',
  },
  'Mantener actividad física': {
    gradient: 'linear-gradient(135deg, #1a1a00 0%, #242400 60%, #141400 100%)',
    accent: '#eab308',
    emoji: '🎯',
  },
};

const ETIQUETAS_DIAS = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

function RutinaCard({ rutina, onAbrir, onEliminar, onCompletar, progreso = 0 }) {
  const tema = TEMAS[rutina.objetivo] || TEMAS['Acondicionamiento general'];
  const imagenRutina = rutina.imagen || obtenerImagenRutina(rutina);

  const totalEjercicios = rutina.dias
    ? Object.values(rutina.dias).reduce((acc, lista) => acc + lista.length, 0)
    : 0;

  const grupos = rutina.grupos && rutina.grupos.length > 0
    ? rutina.grupos
    : Object.values(rutina.dias || {}).flat().map((e) => e.grupoMuscular).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);

  return (
    <Card className="forza-card rutina-card h-100 overflow-hidden">
      {/* Cabecera con fotografía deportiva y degradado de integración */}
      <div
        className="position-relative d-flex align-items-end p-3 overflow-hidden"
        style={{ height: '160px', background: rutina.colorGradient || tema.gradient }}
      >
        {imagenRutina && (
          <img
            src={imagenRutina}
            alt={rutina.nombre}
            loading="lazy"
            className="position-absolute top-0 start-0 w-100 h-100 rutina-card-img"
            style={{
              objectFit: 'cover',
              objectPosition: 'center 25%',
              filter: 'brightness(0.65) contrast(1.15)',
              transition: 'transform 0.4s ease, filter 0.4s ease',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        {/* Degradado superpuesto para garantizar excelente contraste */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to top, rgba(13, 17, 20, 0.95) 0%, rgba(13, 17, 20, 0.4) 55%, rgba(8, 11, 13, 0.5) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge de nivel */}
        <Badge
          className="position-absolute top-0 start-0 m-2 small px-2 py-1 shadow-sm"
          style={{
            backgroundColor: 'rgba(8, 11, 13, 0.75)',
            color: tema.accent,
            border: `1px solid ${tema.accent}66`,
            backdropFilter: 'blur(6px)',
          }}
        >
          {rutina.nivel || 'Principiante'}
        </Badge>

        {/* Icono de objetivo */}
        <span
          className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-semibold"
          style={{
            fontSize: '0.68rem',
            backgroundColor: 'rgba(8, 11, 13, 0.75)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {rutina.emoji || tema.emoji}
        </span>

        {/* Info superpuesta */}
        <div className="position-relative z-1 w-100">
          <h5 className="fw-bold text-white mb-0 lh-sm" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
            {rutina.nombre}
          </h5>
          <small className="text-white-50" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {rutina.objetivo}
          </small>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3" style={{ background: 'var(--bg-card)' }}>
        {/* Grupos musculares */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {grupos.slice(0, 3).map((g) => (
            <Badge key={g} bg="dark" className="small text-secondary border border-secondary" style={{ fontSize: '0.7rem' }}>
              {g}
            </Badge>
          ))}
          {grupos.length > 3 && (
            <Badge bg="dark" className="small text-secondary border border-secondary" style={{ fontSize: '0.7rem' }}>
              +{grupos.length - 3}
            </Badge>
          )}
        </div>

        {/* Métricas con íconos: días, duración, ejercicios */}
        <div className="d-flex justify-content-between text-secondary small mb-3">
          <span>📅 {rutina.diasSeleccionados?.length || 0} días/sem</span>
          <span>⏱️ {rutina.duracionMin || 45} min</span>
          <span>💪 {totalEjercicios} ej.</span>
        </div>

        {/* Días como badges verdes */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {(rutina.diasSeleccionados || []).map((dia) => (
            <span
              key={dia}
              className="rounded-pill px-2 py-0 small fw-bold"
              style={{
                backgroundColor: 'rgba(158, 240, 26, 0.12)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(158, 240, 26, 0.25)',
                fontSize: '0.7rem',
              }}
            >
              {ETIQUETAS_DIAS[dia] || dia}
            </span>
          ))}
        </div>

        {/* Barra de progreso si hay datos */}
        {progreso > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between small text-secondary mb-1">
              <span>Progreso del mes</span>
              <span style={{ color: 'var(--color-primary)' }}>{progreso}%</span>
            </div>
            <ProgressBar
              now={progreso}
              style={{ height: '5px', backgroundColor: 'var(--border-color)' }}
            />
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-auto d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <Button
              className="forza-btn-primary flex-fill btn-sm"
              onClick={() => onAbrir(rutina)}
            >
              Ver detalle →
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="px-2 border-secondary"
              onClick={() => onEliminar(rutina.id)}
              title="Eliminar rutina"
            >
              🗑️
            </Button>
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="border-secondary text-light"
            onClick={() => onCompletar(rutina)}
          >
            ✅ Marcar sesión completada
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RutinaCard;
