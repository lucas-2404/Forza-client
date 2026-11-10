import { useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  obtenerRutinaPorId,
  RUTINAS_RECOMENDADAS,
  registrarEntrenamiento,
  obtenerImagenRutina,
  obtenerImagenEjercicio,
} from '../services/rutinasService';
import {
  CalendarIcon,
  TimerIcon,
  DumbbellIcon,
  ZapIcon,
  PlayIcon,
  EditIcon,
  CheckIcon,
} from '../components/layout/Icons';

/**
 * RutinaDetallePage.jsx — Detalle de Rutina (Diseño Premium FORZA).
 * Reproduce fielmente la referencia visual:
 * - Hero banner con fotografía deportiva y badges musculares
 * - Columna Izquierda: Días de entrenamiento con selector activo y botón de sesión
 * - Columna Derecha: Tarjetas de ejercicios con foto, series, reps y estado interactivo
 */

const ETIQUETAS_DIAS = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const SUBTITULOS_DIAS = {
  lunes: 'Día de fuerza (Superior)',
  martes: 'Día de fuerza (Superior)',
  miercoles: 'Día de piernas y core',
  jueves: 'Día de fuerza (Inferior)',
  viernes: 'Día de acondicionamiento',
  sabado: 'Día de resistencia',
  domingo: 'Día de recuperación activa',
};

function RutinaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const rutinaUsuario = obtenerRutinaPorId(id);
  const rutinaRecomendada = RUTINAS_RECOMENDADAS.find((r) => r.id === id);
  const rutina = rutinaUsuario || rutinaRecomendada;

  const [completados, setCompletados] = useState({});
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [diaActivo, setDiaActivo] = useState(
    rutina ? rutina.diasSeleccionados?.[0] || Object.keys(rutina.dias || {})[0] : null
  );

  if (!rutina) {
    return (
      <Container className="py-5 text-center">
        <div className="mb-3 text-secondary">
          <DumbbellIcon size={56} className="text-secondary" />
        </div>
        <h2 className="text-light mb-2">Rutina no encontrada</h2>
        <p className="text-secondary mb-4">Esta rutina no existe o fue eliminada.</p>
        <Button className="forza-btn-primary fw-bold" onClick={() => navigate('/rutinas')}>
          ← Volver a Rutinas
        </Button>
      </Container>
    );
  }

  const ejerciciosDelDia = rutina.dias?.[diaActivo] || [];
  const totalEjercicios = ejerciciosDelDia.length;
  const completadosDelDia = Object.keys(completados).filter(
    (k) => k.startsWith(diaActivo) && completados[k]
  ).length;
  const porcentajeProgreso = totalEjercicios > 0
    ? Math.round((completadosDelDia / totalEjercicios) * 100)
    : 0;

  const toggleCompletado = (diaId, indice) => {
    const key = `${diaId}-${indice}`;
    setCompletados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const estaCompletado = (diaId, indice) => !!completados[`${diaId}-${indice}`];

  const handleIniciarSesion = () => {
    setSesionIniciada(true);
    setCompletados({});
    Swal.fire({
      title: '¡Sesión iniciada!',
      text: 'Marcá cada ejercicio completado a medida que avances en tu entrenamiento.',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
      background: '#171C20',
      color: '#ffffff',
      confirmButtonColor: '#9EF01A',
    });
  };

  const handleFinalizarSesion = async () => {
    const { value: duracion } = await Swal.fire({
      title: '¡Sesión finalizada!',
      html: `
        <p class="text-secondary small mb-2">Completaste <strong class="text-light">${completadosDelDia}</strong> de <strong class="text-light">${totalEjercicios}</strong> ejercicios.</p>
        <label class="text-secondary small d-block mb-1">¿Cuántos minutos duró la sesión?</label>
        <input id="swal-duracion" type="number" min="1" max="300" value="${rutina.duracionMin || 45}"
          class="form-control bg-dark text-light border-secondary text-center mx-auto" style="max-width:120px">
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
      preConfirm: () => {
        const v = parseInt(document.getElementById('swal-duracion').value, 10);
        if (!v || v <= 0) {
          Swal.showValidationMessage('Ingresá una duración válida.');
          return false;
        }
        return v;
      },
    });

    if (duracion) {
      const res = registrarEntrenamiento(rutina.id, rutina.nombre, duracion);
      if (res === null) {
        Swal.fire({
          title: 'Ya registrado hoy',
          text: 'Mañana podés volver a entrenar.',
          icon: 'info',
          background: '#171C20',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });
      } else {
        Swal.fire({
          title: '¡Excelente trabajo!',
          text: `+${duracion} min registrados en tu historial.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#171C20',
          color: '#ffffff',
        });
        setSesionIniciada(false);
        setCompletados({});
        navigate('/rutinas');
      }
    }
  };

  const grupos = rutina.grupos && rutina.grupos.length > 0
    ? rutina.grupos
    : Object.values(rutina.dias || {})
        .flat()
        .map((e) => e?.grupoMuscular)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i);

  const totalEjerciciosRutina = Object.values(rutina.dias || {}).reduce(
    (acc, l) => acc + (l?.length || 0),
    0
  );

  return (
    <Container className="py-3">
      {/* ─── BREADCRUMB ──────────────────────────────────────────────────────── */}
      <div className="mb-3 d-flex align-items-center gap-1 text-secondary small">
        <Link to="/rutinas" className="text-secondary text-decoration-none">
          ← Rutinas
        </Link>
        <span>/</span>
        <span className="text-light">{rutina.nombre}</span>
      </div>

      {/* ─── HERO DE LA RUTINA ───────────────────────────────────────────────── */}
      <div className="rutina-hero p-4 p-md-5 mb-4">
        {/* Fotografía de fondo integrada */}
        <img
          src={rutina.imagen || obtenerImagenRutina(rutina)}
          alt={rutina.nombre}
          loading="lazy"
          className="rutina-hero-img d-none d-md-block"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Degradado para integración suave con el fondo */}
        <div className="rutina-hero-overlay" />

        <Row className="align-items-center position-relative z-1">
          <Col md={8} lg={7}>
            <div className="rutina-hero-badge mb-3">
              <ZapIcon size={14} />
              <span>
                {rutinaUsuario ? 'Rutina personalizada' : 'Rutina recomendada'}
              </span>
            </div>

            <h1 className="display-6 fw-bold text-white mb-2">{rutina.nombre}</h1>
            <p className="text-secondary mb-3 col-lg-11" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
              {rutina.descripcion || `Rutina de ${rutina.objetivo?.toLowerCase() || 'entrenamiento'} diseñada para progresión constante.`}
            </p>

            {/* Badges de grupos musculares */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {grupos.map((g, idx) => {
                const colores = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'];
                const col = colores[idx % colores.length];
                return (
                  <span
                    key={g}
                    className="rutina-muscle-badge"
                    style={{
                      backgroundColor: `${col}18`,
                      borderColor: `${col}44`,
                      color: col,
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </div>

            {/* Métricas con iconos SVG */}
            <div className="d-flex flex-wrap gap-4 text-secondary small">
              <span className="d-flex align-items-center gap-2">
                <CalendarIcon size={15} className="text-secondary" />
                <span>{rutina.diasSeleccionados?.length || Object.keys(rutina.dias || {}).length} días/semana</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <TimerIcon size={15} className="text-secondary" />
                <span>{rutina.duracionMin || 45} min por sesión</span>
              </span>
              <span className="d-flex align-items-center gap-2">
                <DumbbellIcon size={15} className="text-secondary" />
                <span>{totalEjerciciosRutina} ejercicios</span>
              </span>
            </div>
          </Col>
        </Row>
      </div>

      {/* ─── BARRA DE PROGRESO DE LA SESIÓN (SI ESTÁ INICIADA) ────────────────── */}
      {sesionIniciada && (
        <Alert
          className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3 border"
          style={{
            background: 'rgba(158, 240, 26, 0.08)',
            borderColor: 'rgba(158, 240, 26, 0.3)',
          }}
        >
          <div className="flex-grow-1 me-3">
            <div className="d-flex justify-content-between small text-light mb-1">
              <span>
                Progreso de la sesión —{' '}
                <strong style={{ color: 'var(--color-primary)' }}>
                  {diaActivo && (ETIQUETAS_DIAS[diaActivo] || diaActivo)}
                </strong>
              </span>
              <strong style={{ color: 'var(--color-primary)' }}>
                {porcentajeProgreso}%
              </strong>
            </div>
            <ProgressBar
              now={porcentajeProgreso}
              style={{ height: '6px', backgroundColor: 'var(--border-color)' }}
            />
          </div>
          <Button
            className="forza-btn-primary btn-sm fw-bold"
            onClick={handleFinalizarSesion}
          >
            Finalizar sesión ✓
          </Button>
        </Alert>
      )}

      {/* ─── CUERPO PRINCIPAL: 2 COLUMNAS ───────────────────────────────────── */}
      <Row className="g-4">
        {/* Columna Izquierda: Panel de Días */}
        <Col xs={12} lg={4}>
          <Card className="rutina-card mb-3 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold text-white mb-1">Días de entrenamiento</h5>
              <p className="text-secondary small mb-3">
                Seleccioná el día que vas a entrenar hoy.
              </p>

              <div className="d-flex flex-column gap-2 mb-4">
                {(rutina.diasSeleccionados || Object.keys(rutina.dias || {})).map((dia) => {
                  const cantidad = rutina.dias?.[dia]?.length || 0;
                  const activo = dia === diaActivo;
                  return (
                    <button
                      key={dia}
                      type="button"
                      className={`rutina-detalle-day-item ${activo ? 'is-active' : ''}`}
                      onClick={() => setDiaActivo(dia)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <CalendarIcon
                          size={20}
                          className={activo ? 'text-success' : 'text-secondary'}
                        />
                        <div>
                          <div
                            className={`fw-bold small ${activo ? 'text-success' : 'text-light'}`}
                          >
                            {ETIQUETAS_DIAS[dia] || dia}
                          </div>
                          <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                            {SUBTITULOS_DIAS[dia] || 'Sesión de entrenamiento'}
                          </small>
                        </div>
                      </div>
                      <span className="rutina-muscle-badge">
                        {cantidad} ej.
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botón Iniciar Sesión */}
              <div className="d-grid mb-2">
                {!sesionIniciada ? (
                  <Button
                    className="forza-btn-primary fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleIniciarSesion}
                  >
                    <PlayIcon size={16} />
                    <span>Iniciar sesión de hoy</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline-secondary"
                    className="border-secondary text-light py-2"
                    onClick={() => {
                      setSesionIniciada(false);
                      setCompletados({});
                    }}
                  >
                    ✕ Cancelar sesión
                  </Button>
                )}
              </div>

              {/* Botón Editar Rutina (si es del usuario) */}
              {rutinaUsuario && (
                <div className="d-grid">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="border-secondary text-secondary py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate(`/rutinas/editar/${rutina.id}`)}
                  >
                    <EditIcon size={14} />
                    <span>Editar rutina</span>
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Columna Derecha: Panel de Ejercicios */}
        <Col xs={12} lg={8}>
          <Card className="rutina-card shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-bold text-white mb-0">
                  Ejercicios — {diaActivo && (ETIQUETAS_DIAS[diaActivo] || diaActivo)}
                </h5>
                <small className="text-secondary">
                  {completadosDelDia}/{totalEjercicios} completados
                </small>
              </div>

              {ejerciciosDelDia.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-2 text-secondary">
                    <DumbbellIcon size={40} className="text-secondary" />
                  </div>
                  <p className="text-secondary small mb-0">
                    No hay ejercicios registrados para este día.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {ejerciciosDelDia.map((ej, idx) => {
                    const hecho = estaCompletado(diaActivo, idx);
                    const imagenSrc =
                      ej.imagenFondo || ej.imagen || obtenerImagenEjercicio(ej);

                    return (
                      <div
                        key={idx}
                        className="rutina-detalle-exercise-card d-flex align-items-center justify-content-between flex-wrap gap-3"
                        style={{
                          borderColor: hecho
                            ? 'rgba(158, 240, 26, 0.4)'
                            : 'var(--border-color)',
                          backgroundColor: hecho
                            ? 'rgba(158, 240, 26, 0.04)'
                            : 'var(--bg-card)',
                        }}
                      >
                        {/* Miniatura de la fotografía del ejercicio */}
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={imagenSrc}
                            alt={ej.nombre}
                            loading="lazy"
                            className="rutina-detalle-exercise-thumb"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div>
                            <h6
                              className="fw-bold text-white mb-1"
                              style={{
                                textDecoration: hecho ? 'line-through' : 'none',
                              }}
                            >
                              {ej.nombre}
                            </h6>
                            <div className="text-secondary small mb-2">
                              <span style={{ color: 'var(--color-primary)' }}>
                                {ej.series} series
                              </span>{' '}
                              × {ej.repeticiones} reps
                              {ej.descanso && <span> · {ej.descanso}s descanso</span>}
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              <span
                                className="rutina-muscle-badge"
                                style={{
                                  backgroundColor: 'rgba(14, 165, 233, 0.15)',
                                  borderColor: 'rgba(14, 165, 233, 0.3)',
                                  color: '#0ea5e9',
                                }}
                              >
                                {ej.grupoMuscular}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Indicador de Estado / Checkbox interactivo */}
                        <div className="ms-auto">
                          {sesionIniciada ? (
                            <button
                              type="button"
                              className={`btn btn-sm d-flex align-items-center gap-2 ${
                                hecho
                                  ? 'btn-success text-dark fw-bold'
                                  : 'btn-outline-secondary text-secondary'
                              }`}
                              style={
                                hecho
                                  ? {
                                      backgroundColor: 'var(--color-primary)',
                                      borderColor: 'var(--color-primary)',
                                      color: '#080B0D',
                                    }
                                  : {}
                              }
                              onClick={() => toggleCompletado(diaActivo, idx)}
                            >
                              {hecho && <CheckIcon size={14} />}
                              <span>{hecho ? 'Completado' : 'Pendiente'}</span>
                            </button>
                          ) : (
                            <div className="d-flex align-items-center gap-2 text-secondary small">
                              <span
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border-color)',
                                  display: 'inline-block',
                                }}
                              />
                              <span>Pendiente</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RutinaDetallePage;
