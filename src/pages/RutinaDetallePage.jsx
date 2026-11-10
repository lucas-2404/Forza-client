import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  obtenerRutinaPorId,
  RUTINAS_RECOMENDADAS,
  registrarEntrenamiento,
  obtenerImagenRutina,
  obtenerImagenEjercicio,
} from '../services/rutinasService';

/**
 * RutinaDetallePage.jsx
 * Muestra el detalle completo de una rutina: ejercicios, series, descansos
 * y permite marcar ejercicios como completados durante la sesión.
 */

const ETIQUETAS_DIAS = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo',
};

function RutinaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscar la rutina: primero en las del usuario, luego en las recomendadas
  const rutinaUsuario = obtenerRutinaPorId(id);
  const rutinaRecomendada = RUTINAS_RECOMENDADAS.find((r) => r.id === id);
  const rutina = rutinaUsuario || rutinaRecomendada;

  // Estado de ejercicios marcados durante la sesión actual
  const [completados, setCompletados] = useState({});
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [diaActivo, setDiaActivo] = useState(
    rutina ? (rutina.diasSeleccionados?.[0] || Object.keys(rutina.dias || {})[0]) : null
  );

  if (!rutina) {
    return (
      <Container className="py-5 text-center">
        <div className="display-1 mb-3">🔍</div>
        <h2 className="text-light mb-2">Rutina no encontrada</h2>
        <p className="text-secondary mb-4">Esta rutina no existe o fue eliminada.</p>
        <Button className="forza-btn-primary" onClick={() => navigate('/rutinas')}>
          ← Volver a Rutinas
        </Button>
      </Container>
    );
  }

  const ejerciciosDelDia = rutina.dias?.[diaActivo] || [];
  const totalEjercicios = ejerciciosDelDia.length;
  const completadosDelDia = Object.keys(completados).filter((k) => k.startsWith(diaActivo)).length;
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
      text: `Tachá los ejercicios a medida que los completés.`,
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
        if (!v || v <= 0) { Swal.showValidationMessage('Ingresá una duración válida.'); return false; }
        return v;
      },
    });

    if (duracion) {
      const res = registrarEntrenamiento(rutina.id, rutina.nombre, duracion);
      if (res === null) {
        Swal.fire({ title: 'Ya registrado hoy', text: 'Mañana podés volver a entrenar.', icon: 'info', background: '#171C20', color: '#ffffff', confirmButtonColor: '#9EF01A' });
      } else {
        Swal.fire({ title: '¡Excelente trabajo!', text: `+${duracion} min registrados en tu historial.`, icon: 'success', timer: 2000, showConfirmButton: false, background: '#171C20', color: '#ffffff' });
        setSesionIniciada(false);
        setCompletados({});
        navigate('/rutinas');
      }
    }
  };

  const grupos = rutina.grupos && rutina.grupos.length > 0
    ? rutina.grupos
    : Object.values(rutina.dias || {}).flat().map((e) => e.grupoMuscular).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <Container className="py-3">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link to="/rutinas" className="text-secondary small text-decoration-none">
          ← Rutinas
        </Link>
        <span className="text-secondary small"> / {rutina.nombre}</span>
      </div>

      {/* ─── CABECERA DE LA RUTINA CON FOTOGRAFÍA DEPORTIVA ─── */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden border border-secondary"
        style={{ backgroundColor: '#0D1114', minHeight: '220px' }}
      >
        {/* Fotografía de fondo integrada */}
        <img
          src={rutina.imagen || obtenerImagenRutina(rutina)}
          alt={rutina.nombre}
          loading="lazy"
          className="position-absolute top-0 end-0 h-100 d-none d-md-block"
          style={{
            width: '52%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.65) contrast(1.15)',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Degradado para integración suave con el fondo */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to right, #0D1114 0%, #0D1114 48%, rgba(13, 17, 20, 0.88) 70%, rgba(13, 17, 20, 0.3) 100%)',
            pointerEvents: 'none',
          }}
        />

        <Row className="align-items-center position-relative z-1">
          <Col md={8} lg={7}>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {grupos.slice(0, 4).map((g) => (
                <Badge
                  key={g}
                  className="px-2 py-1 small"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {g}
                </Badge>
              ))}
              <Badge
                className="px-2 py-1 small"
                style={{
                  backgroundColor: 'rgba(158, 240, 26, 0.15)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(158, 240, 26, 0.3)',
                }}
              >
                {rutina.nivel || 'Principiante'}
              </Badge>
            </div>
            <h1 className="h2 fw-bold text-white mb-2">{rutina.nombre}</h1>
            <p className="text-white-50 mb-3">
              {rutina.descripcion || `Rutina de ${rutina.objetivo?.toLowerCase() || 'entrenamiento'}.`}
            </p>
            <div className="d-flex flex-wrap gap-3 text-white-50 small">
              <span>📅 {rutina.diasSeleccionados?.length || 0} días/semana</span>
              <span>⏱️ {rutina.duracionMin || 45} min por sesión</span>
              <span>💪 {Object.values(rutina.dias || {}).flat().length} ejercicios</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* ─── BARRA DE PROGRESO DE LA SESIÓN ─── */}
      {sesionIniciada && (
        <Alert className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-3 border border-secondary"
          style={{ background: 'rgba(158, 240, 26, 0.08)', borderColor: 'rgba(158, 240, 26, 0.3) !important' }}>
          <div className="flex-grow-1 me-3">
            <div className="d-flex justify-content-between small text-light mb-1">
              <span>Progreso de la sesión — {diaActivo && ETIQUETAS_DIAS[diaActivo]}</span>
              <strong style={{ color: 'var(--color-primary)' }}>{porcentajeProgreso}%</strong>
            </div>
            <ProgressBar now={porcentajeProgreso} style={{ height: '6px', backgroundColor: 'var(--border-color)' }} />
          </div>
          <Button
            className="forza-btn-primary btn-sm"
            onClick={handleFinalizarSesion}
          >
            Finalizar sesión ✓
          </Button>
        </Alert>
      )}

      <Row className="g-4">
        {/* ─── PANEL IZQUIERDO: Días de la semana ─── */}
        <Col lg={4}>
          <Card className="forza-card border-secondary">
            <Card.Body className="p-3">
              <h6 className="fw-bold text-light mb-3">Días de entrenamiento</h6>
              <div className="d-flex flex-column gap-2">
                {(rutina.diasSeleccionados || Object.keys(rutina.dias || {})).map((dia) => {
                  const cantidad = rutina.dias?.[dia]?.length || 0;
                  const activo = dia === diaActivo;
                  return (
                    <button
                      key={dia}
                      type="button"
                      className="d-flex justify-content-between align-items-center p-3 rounded-3 border text-start w-100 btn"
                      style={{
                        background: activo ? 'rgba(158, 240, 26, 0.1)' : 'var(--bg-main)',
                        borderColor: activo ? 'var(--color-primary)' : 'var(--border-color)',
                        color: activo ? 'var(--color-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => setDiaActivo(dia)}
                    >
                      <span className="fw-semibold">{ETIQUETAS_DIAS[dia] || dia}</span>
                      <Badge bg="dark" className="border border-secondary text-secondary small">
                        {cantidad} ej.
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* Botón iniciar/continuar sesión */}
          <div className="mt-3 d-grid">
            {!sesionIniciada ? (
              <Button className="forza-btn-primary" onClick={handleIniciarSesion}>
                ▶ Iniciar sesión de hoy
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                className="border-secondary text-light"
                onClick={() => { setSesionIniciada(false); setCompletados({}); }}
              >
                ✕ Cancelar sesión
              </Button>
            )}
          </div>

          {/* Editar rutina (solo si es del usuario) */}
          {rutinaUsuario && (
            <div className="mt-2 d-grid">
              <Button
                variant="outline-secondary"
                size="sm"
                className="border-secondary text-secondary"
                onClick={() => navigate(`/rutinas/editar/${rutina.id}`)}
              >
                ✏️ Editar rutina
              </Button>
            </div>
          )}
        </Col>

        {/* ─── PANEL DERECHO: Lista de ejercicios del día ─── */}
        <Col lg={8}>
          <Card className="forza-card border-secondary">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-light mb-0">
                  Ejercicios — {diaActivo && ETIQUETAS_DIAS[diaActivo]}
                </h6>
                <small className="text-secondary">
                  {completadosDelDia}/{totalEjercicios} completados
                </small>
              </div>

              {ejerciciosDelDia.length === 0 ? (
                <div className="text-center py-4">
                  <span className="fs-2 d-block mb-2">📭</span>
                  <p className="text-secondary small">No hay ejercicios para este día.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {ejerciciosDelDia.map((ej, idx) => {
                    const hecho = estaCompletado(diaActivo, idx);
                    return (
                      <div
                        key={idx}
                        className="d-flex align-items-start gap-3 p-3 rounded-3 border"
                        style={{
                          background: hecho ? 'rgba(158, 240, 26, 0.06)' : 'var(--bg-main)',
                          borderColor: hecho ? 'rgba(158, 240, 26, 0.3)' : 'var(--border-color)',
                          transition: 'all 0.2s ease',
                          opacity: hecho ? 0.75 : 1,
                        }}
                      >
                        {/* Checkbox personalizado cuando la sesión está iniciada */}
                        {sesionIniciada && (
                          <button
                            type="button"
                            className="rounded-circle border flex-shrink-0 d-flex align-items-center justify-content-center"
                            style={{
                              width: '28px', height: '28px', marginTop: '10px',
                              background: hecho ? 'var(--color-primary)' : 'transparent',
                              borderColor: hecho ? 'var(--color-primary)' : 'var(--border-color)',
                              cursor: 'pointer',
                              color: '#000',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => toggleCompletado(diaActivo, idx)}
                            title={hecho ? 'Desmarcar' : 'Marcar completado'}
                          >
                            {hecho ? '✓' : ''}
                          </button>
                        )}

                        {/* Miniatura visual del ejercicio */}
                        <div
                          className="rounded-3 overflow-hidden border flex-shrink-0 position-relative"
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#0D1114',
                            borderColor: hecho ? 'rgba(158, 240, 26, 0.4)' : 'var(--border-color)',
                          }}
                        >
                          <img
                            src={ej.imagen || obtenerImagenEjercicio(ej)}
                            alt={ej.nombre}
                            loading="lazy"
                            className="w-100 h-100"
                            style={{
                              objectFit: 'cover',
                              filter: hecho ? 'grayscale(0.8) opacity(0.65)' : 'none',
                              transition: 'all 0.2s ease',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div
                            className="w-100 h-100 align-items-center justify-content-center text-secondary"
                            style={{ display: 'none', fontSize: '1.4rem' }}
                          >
                            {ej.icono || '💪'}
                          </div>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start flex-wrap gap-1">
                            <div>
                              <span
                                className="fw-bold small text-light"
                                style={{ textDecoration: hecho ? 'line-through' : 'none' }}
                              >
                                {ej.nombre}
                              </span>
                              <div className="text-secondary" style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--color-primary)' }}>{ej.series} series</span>
                                {' '}&times;{' '}
                                <span className="text-light">{ej.repeticiones} reps</span>
                                {ej.descanso && <span> · {ej.descanso}s descanso</span>}
                              </div>
                            </div>
                            <Badge bg="dark" className="border border-secondary text-secondary" style={{ fontSize: '0.68rem' }}>
                              {ej.grupoMuscular}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {sesionIniciada && completadosDelDia === totalEjercicios && totalEjercicios > 0 && (
                <div
                  className="text-center mt-4 p-3 rounded-3"
                  style={{ background: 'rgba(158, 240, 26, 0.1)', border: '1px solid rgba(158, 240, 26, 0.3)' }}
                >
                  <div className="fs-2 mb-1">🎉</div>
                  <div className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                    ¡Completaste todos los ejercicios!
                  </div>
                  <small className="text-secondary">Ya podés finalizar la sesión.</small>
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

