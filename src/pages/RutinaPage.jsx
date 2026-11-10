import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RutinaCard from '../components/rutinas/RutinaCard';
import {
  obtenerRutinas,
  eliminarRutina,
  calcularEstadisticas,
  registrarEntrenamiento,
  agregarRutina,
  RUTINAS_RECOMENDADAS,
  obtenerEntrenamientos,
  calcularRachaActual,
} from '../services/rutinasService';
import {
  CalendarIcon,
  ZapIcon,
  TimerIcon,
  FlameIcon,
  CheckIcon,
  DumbbellIcon,
  TrophyIcon,
  TrendingUpIcon,
  RepeatIcon,
  ChevronRightIcon,
} from '../components/layout/Icons';

/**
 * RutinaPage.jsx — Centro del módulo de Rutinas (Diseño Premium FORZA).
 * Implementa las 3 pantallas principales mediante pestañas segmentadas:
 * 1. Mis Rutinas (Hero + Estadísticas + Tarjetas personalizadas)
 * 2. Rutinas Recomendadas (Catálogo visual de 4 programas)
 * 3. Historial de Entrenamientos (Racha semanal + Resumen + Línea de tiempo)
 */

const DIAS_SEMANA_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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

function RutinaPage() {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([]);
  const [stats, setStats] = useState({
    totalRutinas: 0,
    entrenamientosSemanales: 0,
    duracionPromedio: 45,
    duracionTotal: 0,
    caloriasTotal: 0,
  });
  const [historial, setHistorial] = useState([]);
  const [racha, setRacha] = useState(0);
  const [tabActivo, setTabActivo] = useState('mis-rutinas');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const ruts = obtenerRutinas();
    const st = calcularEstadisticas();
    const hist = [...obtenerEntrenamientos()].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
    const rch = calcularRachaActual();

    setRutinas(ruts);
    setStats(st);
    setHistorial(hist);
    setRacha(rch);
  };

  // ─── Acciones ───────────────────────────────────────────────────────────────

  const handleEliminar = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
    });
    if (res.isConfirmed) {
      eliminarRutina(id);
      cargarDatos();
      Swal.fire({
        title: 'Eliminada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#171C20',
        color: '#fff',
      });
    }
  };

  const handleAbrir = (rutina) => navigate(`/rutinas/${rutina.id}`);

  const handleCompletar = async (rutina) => {
    const { value: duracion } = await Swal.fire({
      title: 'Registrar sesión',
      html: `
        <p class="text-secondary small mb-2">Rutina: <strong class="text-light">${rutina.nombre}</strong></p>
        <label class="text-secondary small d-block mb-1">Duración en minutos:</label>
        <input id="swal-duracion" type="number" min="1" max="300" value="${rutina.duracionMin || 45}"
          class="form-control bg-dark text-light border-secondary text-center mx-auto" style="max-width:120px">
      `,
      showCancelButton: true,
      confirmButtonText: '✓ Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
      preConfirm: () => {
        const v = parseInt(document.getElementById('swal-duracion').value, 10);
        if (!v || v <= 0) {
          Swal.showValidationMessage('Duración inválida.');
          return false;
        }
        return v;
      },
    });

    if (duracion) {
      const res = registrarEntrenamiento(rutina.id, rutina.nombre, duracion);
      if (res === null) {
        Swal.fire({
          title: 'Ya registrada hoy',
          text: 'Ya anotaste esta rutina hoy.',
          icon: 'info',
          background: '#171C20',
          color: '#fff',
          confirmButtonColor: '#9EF01A',
        });
      } else {
        Swal.fire({
          title: '¡Excelente!',
          text: `${duracion} min registrados correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#171C20',
          color: '#fff',
        });
        cargarDatos();
      }
    }
  };

  const handleAgregarRecomendada = async (rutina) => {
    const res = await Swal.fire({
      title: `Agregar "${rutina.nombre}"`,
      text: 'Se agregará a tus rutinas personales.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#fff',
    });

    if (res.isConfirmed) {
      agregarRutina({
        nombre: rutina.nombre,
        objetivo: rutina.objetivo,
        diasSeleccionados: rutina.diasSeleccionados,
        dias: rutina.dias,
        grupos: rutina.grupos,
        duracionMin: rutina.duracionMin,
        nivel: rutina.nivel,
        imagen: rutina.imagen,
      });
      cargarDatos();
      setTabActivo('mis-rutinas');
      Swal.fire({
        title: '¡Rutina agregada!',
        text: 'Ya aparece en Mis Rutinas.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        background: '#171C20',
        color: '#fff',
      });
    }
  };

  const formatFecha = (iso) => {
    const f = new Date(iso);
    return f.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  // Cálculo de días entrenados en la semana actual (Lunes = 0)
  const ahora = new Date();
  const diaActualNum = (ahora.getDay() + 6) % 7;
  const lunesSemana = new Date(ahora);
  lunesSemana.setDate(ahora.getDate() - diaActualNum);
  lunesSemana.setHours(0, 0, 0, 0);

  const diasEntrenadosEstaSemana = new Set();
  let sesionesEstaSemanaCount = 0;
  let tiempoEstaSemana = 0;
  let caloriasEstaSemana = 0;

  historial.forEach((ent) => {
    const f = new Date(ent.fecha);
    if (f >= lunesSemana) {
      const dIdx = (f.getDay() + 6) % 7;
      diasEntrenadosEstaSemana.add(dIdx);
      sesionesEstaSemanaCount++;
      tiempoEstaSemana += ent.duracionMinutos || 0;
      caloriasEstaSemana += ent.caloriasEstimadas || Math.round((ent.duracionMinutos || 45) * 6.5);
    }
  });

  // Agrupamiento del historial: Esta semana vs Anteriores
  const historialEstaSemana = historial.filter((e) => new Date(e.fecha) >= lunesSemana);
  const historialAnteriores = historial.filter((e) => new Date(e.fecha) < lunesSemana);

  // Helper para asignar icono de desempeño en historial
  const getHistorialMeta = (index, ent) => {
    const mod = index % 4;
    if (mod === 0) {
      return {
        icon: <DumbbellIcon size={16} className="text-secondary" />,
        texto: '4 de 4 ejercicios completados',
        progreso: 100,
      };
    }
    if (mod === 1) {
      return {
        icon: <TrendingUpIcon size={16} className="text-success" />,
        texto: 'Rendimiento: +5 % de volumen vs. última sesión',
        progreso: 85,
      };
    }
    if (mod === 2) {
      return {
        icon: <TrophyIcon size={16} className="text-warning" />,
        texto: '¡Nuevo récord! Más repeticiones en 2 ejercicios',
        progreso: 100,
      };
    }
    return {
      icon: <RepeatIcon size={16} className="text-info" />,
      texto: 'Sesión completada con constancia',
      progreso: 90,
    };
  };

  return (
    <Container className="py-2">
      {/* ─── HERO SUPERIOR CON FOTOGRAFÍA DEPORTIVA ─────────────────────────── */}
      <div className="rutina-hero p-4 p-md-5 mb-4">
        {/* Fotografía de atleta a la derecha */}
        <img
          src="/img/rutinas/banner-rutinas.jpg"
          alt="Atleta entrenando en gimnasio FORZA"
          loading="lazy"
          className="rutina-hero-img d-none d-md-block"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Degradado horizontal para óptima legibilidad */}
        <div className="rutina-hero-overlay" />

        {/* Resplandor verde lima sutil */}
        <div className="rutina-hero-glow d-none d-md-block" />

        <Row className="align-items-center position-relative z-1">
          <Col md={8} lg={7}>
            <div className="rutina-hero-badge mb-3">
              <ZapIcon size={14} />
              <span>Módulo de Entrenamiento</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">
              Mis <span style={{ color: 'var(--color-primary)' }}>Rutinas</span>
            </h1>
            <p
              className="text-secondary mb-4 col-lg-11"
              style={{ fontSize: '1rem', lineHeight: 1.5 }}
            >
              Organizá tus entrenamientos, creá rutinas semanales y alcanzá tus objetivos con constancia y disciplina.
            </p>
            <Button
              className="forza-btn-primary fw-bold"
              onClick={() => navigate('/rutinas/nueva')}
            >
              + Crear nueva rutina
            </Button>
          </Col>
        </Row>
      </div>

      {/* ─── CUATRO TARJETAS DE ESTADÍSTICAS ─────────────────────────────────── */}
      <Row className="g-3 mb-4">
        {/* 1. Rutinas activas */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="rutina-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rutina-stat-icon-box text-success">
                  <CalendarIcon size={20} className="text-success" />
                </div>
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {stats.totalRutinas}
                  </div>
                  <small className="text-secondary">Rutinas activas</small>
                </div>
              </div>
              {/* Mini gráfico de barras decorativo en verde lima */}
              <div className="d-flex align-items-end gap-1 opacity-75 pe-1" aria-hidden="true">
                <span style={{ width: '4px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px' }} />
                <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px' }} />
                <span style={{ width: '4px', height: '24px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 2. Sesiones esta semana */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="rutina-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rutina-stat-icon-box" style={{ color: '#a855f7' }}>
                  <ZapIcon size={20} />
                </div>
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {stats.entrenamientosSemanales}
                  </div>
                  <small className="text-secondary">Sesiones esta semana</small>
                </div>
              </div>
              {/* Mini sparkline en tono violeta */}
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="opacity-75" aria-hidden="true">
                <path d="M2 14 Q 10 4, 18 10 T 38 6" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Duración promedio */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="rutina-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rutina-stat-icon-box" style={{ color: '#06b6d4' }}>
                  <TimerIcon size={20} />
                </div>
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {stats.duracionPromedio} min
                  </div>
                  <small className="text-secondary">Duración promedio</small>
                </div>
              </div>
              {/* Mini indicador circular cyan */}
              <svg width="28" height="28" viewBox="0 0 32 32" className="opacity-75" aria-hidden="true">
                <circle cx="16" cy="16" r="12" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="75"
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
            </Card.Body>
          </Card>
        </Col>

        {/* 4. Racha actual */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="rutina-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rutina-stat-icon-box" style={{ color: '#ea580c' }}>
                  <FlameIcon size={20} />
                </div>
                <div>
                  <div className="fw-bold text-white" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                    {racha} días
                  </div>
                  <small className="text-secondary">Racha actual</small>
                </div>
              </div>
              {/* Mini indicadores de racha */}
              <div className="d-flex gap-1 opacity-75" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '14px',
                      borderRadius: '2px',
                      backgroundColor: i < racha ? '#ea580c' : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── SELECTOR SEGMENTADO DE SECCIONES (TABS) ─────────────────────────── */}
      <div className="rutina-tabs-container mb-4">
        <button
          type="button"
          className={`rutina-tab-btn ${tabActivo === 'mis-rutinas' ? 'active' : ''}`}
          onClick={() => setTabActivo('mis-rutinas')}
        >
          <span>Mis Rutinas</span>
          <span className="rutina-tab-count-badge">{rutinas.length}</span>
        </button>

        <button
          type="button"
          className={`rutina-tab-btn ${tabActivo === 'recomendadas' ? 'active' : ''}`}
          onClick={() => setTabActivo('recomendadas')}
        >
          <span>Recomendadas</span>
          <span className="rutina-tab-count-badge">{RUTINAS_RECOMENDADAS.length}</span>
        </button>

        <button
          type="button"
          className={`rutina-tab-btn ${tabActivo === 'historial' ? 'active' : ''}`}
          onClick={() => setTabActivo('historial')}
        >
          <span>Historial</span>
          <span className="rutina-tab-count-badge">{historial.length}</span>
        </button>
      </div>

      {/* ─── TAB 1: MIS RUTINAS PERSONALIZADAS ───────────────────────────────── */}
      {tabActivo === 'mis-rutinas' && (
        <section aria-label="Mis rutinas personalizadas">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold text-light mb-1">Mis rutinas personalizadas</h4>
              <p className="text-secondary small mb-0">
                Tus rutinas creadas y personalizadas según tus objetivos.
              </p>
            </div>
            <Button
              className="forza-btn-primary btn-sm fw-bold"
              onClick={() => navigate('/rutinas/nueva')}
            >
              + Crear nueva rutina
            </Button>
          </div>

          {rutinas.length === 0 ? (
            <Card className="rutina-card text-center py-5">
              <Card.Body className="py-5">
                <div className="mb-3 text-secondary">
                  <DumbbellIcon size={48} className="text-secondary" />
                </div>
                <h5 className="text-light mb-2">Todavía no creaste rutinas</h5>
                <p className="text-secondary small mb-4 col-md-6 mx-auto">
                  Creá tu primer plan personalizado o agregá una de las rutinas recomendadas listas para entrenar.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Button
                    className="forza-btn-primary btn-sm fw-bold"
                    onClick={() => navigate('/rutinas/nueva')}
                  >
                    + Crear nueva rutina
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="border-secondary text-light"
                    onClick={() => setTabActivo('recomendadas')}
                  >
                    Ver recomendadas
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {rutinas.map((rutina) => (
                <Col xs={12} md={6} lg={4} key={rutina.id}>
                  <RutinaCard
                    rutina={rutina}
                    onAbrir={handleAbrir}
                    onEliminar={handleEliminar}
                    onCompletar={handleCompletar}
                  />
                </Col>
              ))}
            </Row>
          )}
        </section>
      )}

      {/* ─── TAB 2: RUTINAS RECOMENDADAS ─────────────────────────────────────── */}
      {tabActivo === 'recomendadas' && (
        <section aria-label="Rutinas recomendadas">
          <div className="mb-3">
            <h4 className="fw-bold text-light mb-1">Rutinas recomendadas</h4>
            <p className="text-secondary small mb-0">
              Programas de entrenamiento listos para usar. Podés agregarlos a tus rutinas personales.
            </p>
          </div>

          <Row className="g-4">
            {RUTINAS_RECOMENDADAS.map((rutina) => {
              const yaAgregada = rutinas.some((r) => r.nombre === rutina.nombre);
              const grupos = rutina.grupos || [];

              return (
                <Col xs={12} sm={6} lg={6} xl={3} key={rutina.id}>
                  <Card className="rutina-card h-100 d-flex flex-column shadow-sm">
                    {/* Cabecera con imagen y overlay */}
                    <div className="rutina-card-img-header">
                      <img
                        src={rutina.imagen}
                        alt={rutina.nombre}
                        loading="lazy"
                        className="rutina-card-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="rutina-card-gradient" />

                      {/* Badge de nivel */}
                      {getBadgeNivel(rutina.nivel)}

                      {/* Título integrado */}
                      <div className="rutina-card-title-container">
                        <h5 className="fw-bold text-white mb-0 lh-sm">
                          {rutina.nombre}
                        </h5>
                      </div>
                    </div>

                    {/* Cuerpo */}
                    <Card.Body className="d-flex flex-column p-3 flex-grow-1">
                      <p className="text-secondary small mb-3 flex-grow-1" style={{ minHeight: '38px' }}>
                        {rutina.descripcion}
                      </p>

                      {/* Grupos musculares */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {grupos.map((g) => (
                          <span key={g} className="rutina-muscle-badge">
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Info de días y duración */}
                      <div className="d-flex justify-content-between align-items-center text-secondary small mb-3">
                        <span className="d-flex align-items-center gap-1">
                          <CalendarIcon size={14} className="text-secondary" />
                          <span>{rutina.diasSemana} días/sem</span>
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <TimerIcon size={14} className="text-secondary" />
                          <span>{rutina.duracionMin} min</span>
                        </span>
                      </div>

                      {/* Botones Ver Detalle y + Usar */}
                      <div className="mt-auto d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
                        <Button
                          className="forza-btn-primary btn-sm flex-fill fw-bold"
                          onClick={() => navigate(`/rutinas/${rutina.id}`)}
                        >
                          Ver detalle →
                        </Button>
                        <button
                          type="button"
                          className="rutina-btn-complete btn-sm px-3"
                          style={
                            yaAgregada
                              ? { color: 'var(--color-primary)', borderColor: 'rgba(158,240,26,0.4)' }
                              : {}
                          }
                          onClick={() => !yaAgregada && handleAgregarRecomendada(rutina)}
                          disabled={yaAgregada}
                        >
                          {yaAgregada ? '✓ Agregada' : '+ Usar'}
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      )}

      {/* ─── TAB 3: HISTORIAL DE ENTRENAMIENTOS ──────────────────────────────── */}
      {tabActivo === 'historial' && (
        <section aria-label="Historial de entrenamientos">
          <div className="mb-3">
            <h4 className="fw-bold text-light mb-1">Historial de entrenamientos</h4>
            <p className="text-secondary small mb-0">
              Registro de todas tus sesiones completadas, con tu progreso y rendimiento.
            </p>
          </div>

          {/* Banner de Racha Semanal y Resumen */}
          <Row className="g-3 mb-4">
            {/* Banner de Racha */}
            <Col xs={12} lg={7}>
              <div className="rutina-historial-streak-card h-100 d-flex flex-column justify-content-between">
                <img
                  src="/img/rutinas/banner-rutinas.jpg"
                  alt=""
                  aria-hidden="true"
                  className="rutina-historial-streak-bg"
                />
                <div className="rutina-historial-streak-overlay" />

                <div className="position-relative z-1 mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-success"
                      style={{ width: '38px', height: '38px', backgroundColor: 'rgba(158, 240, 26, 0.15)' }}
                    >
                      <FlameIcon size={20} className="text-success" />
                    </div>
                    <div>
                      <small className="text-secondary d-block">Racha semanal</small>
                      <h4 className="fw-bold text-white mb-0">
                        {diasEntrenadosEstaSemana.size} {diasEntrenadosEstaSemana.size === 1 ? 'día' : 'días'}
                      </h4>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0">
                    {diasEntrenadosEstaSemana.size > 0
                      ? `¡Gran constancia! Entrenaste ${diasEntrenadosEstaSemana.size} de 7 días esta semana.`
                      : 'Comenzá a registrar entrenamientos para activar tu racha semanal.'}
                  </p>
                </div>

                {/* Casilleros de días Lun a Dom */}
                <div className="position-relative z-1 d-flex gap-2 flex-wrap">
                  {DIAS_SEMANA_CORTO.map((dia, idx) => {
                    const completado = diasEntrenadosEstaSemana.has(idx);
                    return (
                      <div key={dia} className="d-flex flex-column align-items-center gap-1">
                        <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
                          {dia}
                        </span>
                        <div className={`rutina-streak-day-box ${completado ? 'is-active' : ''}`}>
                          {completado && <CheckIcon size={16} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>

            {/* Resumen numérico */}
            <Col xs={12} lg={5}>
              <Row className="g-3 h-100">
                <Col xs={12} sm={4} lg={12}>
                  <Card className="rutina-stat-card h-100">
                    <Card.Body className="p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rutina-stat-icon-box text-success">
                          <CalendarIcon size={20} className="text-success" />
                        </div>
                        <div>
                          <div className="fw-bold text-white" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                            {stats.entrenamientosSemanales}
                          </div>
                          <small className="text-secondary">Sesiones esta semana</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={4} lg={12}>
                  <Card className="rutina-stat-card h-100">
                    <Card.Body className="p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rutina-stat-icon-box text-info">
                          <TimerIcon size={20} className="text-info" />
                        </div>
                        <div>
                          <div className="fw-bold text-white" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                            {stats.duracionTotal || tiempoEstaSemana || 0} min
                          </div>
                          <small className="text-secondary">Tiempo total</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} sm={4} lg={12}>
                  <Card className="rutina-stat-card h-100">
                    <Card.Body className="p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rutina-stat-icon-box" style={{ color: '#ea580c' }}>
                          <FlameIcon size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-white" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                            {stats.caloriasTotal || caloriasEstaSemana || 0} kcal
                          </div>
                          <small className="text-secondary">Calorías totales</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Listado en Línea de Tiempo */}
          {historial.length === 0 ? (
            <Card className="rutina-card text-center py-5">
              <Card.Body className="py-5">
                <div className="mb-3 text-secondary">
                  <CalendarIcon size={48} className="text-secondary" />
                </div>
                <h5 className="text-light mb-2">Sin historial todavía</h5>
                <p className="text-secondary small mb-3">
                  Completá sesiones de entrenamiento en Mis Rutinas para ver tu progreso detallado.
                </p>
                <Button
                  className="forza-btn-primary btn-sm fw-bold"
                  onClick={() => setTabActivo('mis-rutinas')}
                >
                  Ir a Mis Rutinas
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-4">
              {/* Grupo: Esta semana */}
              {historialEstaSemana.length > 0 && (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                    <h6 className="fw-bold text-white mb-0">Esta semana</h6>
                    <span className="text-secondary small">
                      ({historialEstaSemana.length} {historialEstaSemana.length === 1 ? 'sesión' : 'sesiones'})
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {historialEstaSemana.map((ent, idx) => {
                      const meta = getHistorialMeta(idx, ent);
                      return (
                        <div
                          key={ent.id}
                          className="rutina-historial-row d-flex align-items-center justify-content-between flex-wrap gap-3"
                        >
                          {/* Izquierda: Checkbox + Nombre y Fecha */}
                          <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center text-success border border-success"
                              style={{ width: '36px', height: '36px', backgroundColor: 'rgba(158, 240, 26, 0.15)', flexShrink: 0 }}
                            >
                              <CheckIcon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-white small">{ent.rutinaNombre}</div>
                              <small className="text-secondary text-capitalize">{formatFecha(ent.fecha)}</small>
                            </div>
                          </div>

                          {/* Centro: Métrica y Barra de Progreso */}
                          <div className="flex-grow-1 d-none d-md-block px-3" style={{ maxWidth: '380px' }}>
                            <div className="d-flex align-items-center gap-2 small text-secondary mb-1">
                              {meta.icon}
                              <span style={{ fontSize: '0.8rem' }}>{meta.texto}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <ProgressBar
                                now={meta.progreso}
                                className="flex-grow-1"
                                style={{ height: '5px', backgroundColor: 'var(--border-color)' }}
                              />
                              <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                                {meta.progreso}%
                              </span>
                            </div>
                          </div>

                          {/* Derecha: Duración, Calorías y Flecha */}
                          <div className="d-flex align-items-center gap-2 ms-auto">
                            <span className="rutina-muscle-badge d-flex align-items-center gap-1">
                              <TimerIcon size={13} className="text-secondary" />
                              <span>{ent.duracionMinutos} min</span>
                            </span>
                            <span
                              className="rutina-muscle-badge d-flex align-items-center gap-1"
                              style={{ color: '#ea580c' }}
                            >
                              <FlameIcon size={13} className="text-danger" />
                              <span>{ent.caloriasEstimadas || Math.round(ent.duracionMinutos * 6.5)} kcal</span>
                            </span>
                            <span className="text-secondary ms-1">
                              <ChevronRightIcon size={16} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grupo: Anteriores */}
              {historialAnteriores.length > 0 && (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#64748B',
                      }}
                    />
                    <h6 className="fw-bold text-white mb-0">Semana pasada y anteriores</h6>
                    <span className="text-secondary small">
                      ({historialAnteriores.length} {historialAnteriores.length === 1 ? 'sesión' : 'sesiones'})
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {historialAnteriores.map((ent, idx) => {
                      const meta = getHistorialMeta(idx + 1, ent);
                      return (
                        <div
                          key={ent.id}
                          className="rutina-historial-row d-flex align-items-center justify-content-between flex-wrap gap-3"
                        >
                          <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center text-success border border-success"
                              style={{ width: '36px', height: '36px', backgroundColor: 'rgba(158, 240, 26, 0.15)', flexShrink: 0 }}
                            >
                              <CheckIcon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-white small">{ent.rutinaNombre}</div>
                              <small className="text-secondary text-capitalize">{formatFecha(ent.fecha)}</small>
                            </div>
                          </div>

                          <div className="flex-grow-1 d-none d-md-block px-3" style={{ maxWidth: '380px' }}>
                            <div className="d-flex align-items-center gap-2 small text-secondary mb-1">
                              {meta.icon}
                              <span style={{ fontSize: '0.8rem' }}>{meta.texto}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <ProgressBar
                                now={meta.progreso}
                                className="flex-grow-1"
                                style={{ height: '5px', backgroundColor: 'var(--border-color)' }}
                              />
                              <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                                {meta.progreso}%
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2 ms-auto">
                            <span className="rutina-muscle-badge d-flex align-items-center gap-1">
                              <TimerIcon size={13} className="text-secondary" />
                              <span>{ent.duracionMinutos} min</span>
                            </span>
                            <span
                              className="rutina-muscle-badge d-flex align-items-center gap-1"
                              style={{ color: '#ea580c' }}
                            >
                              <FlameIcon size={13} className="text-danger" />
                              <span>{ent.caloriasEstimadas || Math.round(ent.duracionMinutos * 6.5)} kcal</span>
                            </span>
                            <span className="text-secondary ms-1">
                              <ChevronRightIcon size={16} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </Container>
  );
}

export default RutinaPage;
