import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  calcularEstadisticas,
  obtenerEntrenamientosPorPeriodo,
  obtenerEntrenamientos,
  calcularRachaActual,
  calcularLogros,
  obtenerImagenRutina,
} from '../services/rutinasService';
import {
  TrophyIcon,
  CalendarIcon,
  TimerIcon,
  FlameIcon,
  TargetIcon,
  MedalIcon,
  LockIcon,
  CheckIcon,
  ChevronRightIcon,
  DumbbellIcon,
  PlayIcon,
  TrendingUpIcon,
} from '../components/layout/Icons';

/**
 * DashboardPage.jsx — Pantalla Mi Progreso (Diseño Premium FORZA).
 * Reproduce fielmente el dashboard deportivo de referencia:
 * 1. Hero con fotografía atlética y botón "+ Nueva Rutina"
 * 2. Cuatro tarjetas métricas (Sesiones, Constancia, Tiempo total, Racha)
 * 3. Gráfico semanal con filtros de período y Panel de Objetivo Mensual
 * 4. Matriz de Logros desbloqueables (2x3) y Paneles de Racha + Sesiones recientes
 * 5. Tabla de Últimas sesiones registradas con miniaturas fotográficas
 */

const OBJETIVO_MENSUAL = 20;

const FILTROS = [
  { key: '1', label: '1 mes', meses: 1 },
  { key: '3', label: '3 meses', meses: 3 },
  { key: '6', label: '6 meses', meses: 6 },
  { key: '12', label: '1 año', meses: 12 },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEntrenamientos: 0,
    entrenamientosEsteMes: 0,
    duracionTotal: 0,
    duracionPromedio: 0,
    caloriasTotal: 0,
  });
  const [datosSemanas, setDatosSemanas] = useState([]);
  const [ultimosEntrenamientos, setUltimosEntrenamientos] = useState([]);
  const [racha, setRacha] = useState(0);
  const [logros, setLogros] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('1');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  // Recalcula el gráfico cuando cambia el filtro temporal
  useEffect(() => {
    const meses = FILTROS.find((f) => f.key === filtroActivo)?.meses || 1;
    setDatosSemanas(obtenerEntrenamientosPorPeriodo(meses));
  }, [filtroActivo]);

  const cargarEstadisticas = () => {
    const estadisticas = calcularEstadisticas();
    const entrenamientos = obtenerEntrenamientos();
    const meses = FILTROS.find((f) => f.key === filtroActivo)?.meses || 1;

    setStats(estadisticas);
    setDatosSemanas(obtenerEntrenamientosPorPeriodo(meses));
    setUltimosEntrenamientos(
      [...entrenamientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 6)
    );
    setRacha(calcularRachaActual());
    setLogros(calcularLogros());
  };

  // ─── Métricas Derivadas ──────────────────────────────────────────────────
  const progresoMensual = Math.min(
    100,
    Math.round(((stats.entrenamientosEsteMes || 0) / OBJETIVO_MENSUAL) * 100)
  );
  const diasTranscurridos = new Date().getDate() || 1;
  const porcentajeConstancia = Math.min(
    100,
    Math.round(((stats.entrenamientosEsteMes || 0) / diasTranscurridos) * 100)
  );
  const maxSemana = Math.max(...datosSemanas.map((s) => s.cantidad), 4);
  const logrosDesbloqueados = logros.filter((l) => l.desbloqueado).length;

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });

  // Helper para asignar fotografía deportiva a cada sesión
  const obtenerThumbnailSesion = (nombreRutina) => {
    return obtenerImagenRutina({ nombre: nombreRutina });
  };

  return (
    <Container className="py-2">
      {/* ─── 1. HERO BANNER DE PROGRESO ─────────────────────────────────────── */}
      <div className="progreso-hero p-4 p-md-5 mb-4">
        {/* Fotografía de atleta en gimnasio a la derecha */}
        <img
          src="/img/progreso/banner-progreso.jpg"
          alt="Atleta entrenando FORZA"
          loading="lazy"
          className="progreso-hero-img d-none d-md-block"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Degradado oscuro para que el texto resalte con máxima nitidez */}
        <div className="progreso-hero-overlay" />

        {/* Resplandor verde lima sutil */}
        <div className="progreso-hero-glow d-none d-md-block" />

        <div className="position-relative z-1 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="progreso-hero-badge mb-2">
              <TrendingUpIcon size={14} />
              <span>Panel de Rendimiento y Estadísticas</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">
              Mi <span style={{ color: 'var(--color-primary)' }}>Progreso</span>
            </h1>
            <p className="text-secondary mb-0 col-md-9" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
              Seguimiento de tus entrenamientos, rachas de constancia, objetivos alcanzados y logros.
            </p>
          </div>
          <Button
            as={Link}
            to="/rutinas/nueva"
            className="forza-btn-primary fw-bold d-flex align-items-center gap-2"
          >
            <PlayIcon size={14} />
            <span>+ Nueva Rutina</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. CUATRO TARJETAS DE ESTADÍSTICAS ─────────────────────────────── */}
      <Row className="g-3 mb-4">
        {/* 1. Sesiones totales */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="progreso-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="progreso-stat-icon-box"
                  style={{
                    backgroundColor: 'rgba(158, 240, 26, 0.15)',
                    border: '1px solid rgba(158, 240, 26, 0.3)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <TrophyIcon size={22} />
                </div>
                <div>
                  <small
                    className="text-secondary text-uppercase fw-semibold d-block"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}
                  >
                    SESIONES TOTALES
                  </small>
                  <div
                    className="fw-bold"
                    style={{ color: 'var(--color-primary)', fontSize: '1.7rem', lineHeight: 1.1 }}
                  >
                    {stats.totalEntrenamientos}
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    registradas
                  </small>
                </div>
              </div>
              {/* Mini onda decorativa en verde lima */}
              <div className="progreso-stat-wave">
                <svg viewBox="0 0 70 35" fill="none" className="w-100 h-100" aria-hidden="true">
                  <path
                    d="M5 25 Q 25 5, 45 20 T 68 10"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 2. Constancia */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="progreso-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="progreso-stat-icon-box"
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#a855f7',
                  }}
                >
                  <CalendarIcon size={22} />
                </div>
                <div>
                  <small
                    className="text-secondary text-uppercase fw-semibold d-block"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}
                  >
                    CONSTANCIA
                  </small>
                  <div
                    className="fw-bold"
                    style={{ color: '#c084fc', fontSize: '1.7rem', lineHeight: 1.1 }}
                  >
                    {porcentajeConstancia}%
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    este mes
                  </small>
                </div>
              </div>
              {/* Mini onda decorativa en violeta */}
              <div className="progreso-stat-wave">
                <svg viewBox="0 0 70 35" fill="none" className="w-100 h-100" aria-hidden="true">
                  <path
                    d="M5 22 Q 22 8, 42 18 T 68 8"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </svg>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Tiempo total */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="progreso-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="progreso-stat-icon-box"
                  style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#06b6d4',
                  }}
                >
                  <TimerIcon size={22} />
                </div>
                <div>
                  <small
                    className="text-secondary text-uppercase fw-semibold d-block"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}
                  >
                    TIEMPO TOTAL
                  </small>
                  <div
                    className="fw-bold"
                    style={{ color: '#22d3ee', fontSize: '1.7rem', lineHeight: 1.1 }}
                  >
                    {stats.duracionTotal > 0 ? `${stats.duracionTotal}m` : '0m'}
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    acumulado
                  </small>
                </div>
              </div>
              {/* Mini onda decorativa en cyan */}
              <div className="progreso-stat-wave">
                <svg viewBox="0 0 70 35" fill="none" className="w-100 h-100" aria-hidden="true">
                  <path
                    d="M5 26 Q 28 8, 48 22 T 68 12"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 4. Racha actual */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="progreso-stat-card h-100">
            <Card.Body className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="progreso-stat-icon-box"
                  style={{
                    backgroundColor: 'rgba(234, 88, 12, 0.15)',
                    border: '1px solid rgba(234, 88, 12, 0.3)',
                    color: '#ea580c',
                  }}
                >
                  <FlameIcon size={22} />
                </div>
                <div>
                  <small
                    className="text-secondary text-uppercase fw-semibold d-block"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}
                  >
                    RACHA ACTUAL
                  </small>
                  <div
                    className="fw-bold"
                    style={{ color: '#fb923c', fontSize: '1.7rem', lineHeight: 1.1 }}
                  >
                    {racha} días
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    consecutivos
                  </small>
                </div>
              </div>
              {/* Mini resplandor naranja */}
              <div className="progreso-stat-wave">
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(234, 88, 12, 0.45) 0%, transparent 70%)',
                    float: 'right',
                    marginTop: '4px',
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── 3. GRÁFICO SEMANAL + OBJETIVO MENSUAL ─────────────────────────── */}
      <Row className="g-4 mb-4">
        {/* Gráfico: Entrenamientos por semana */}
        <Col xs={12} lg={7}>
          <Card className="progreso-chart-card h-100 shadow-sm p-4 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="text-success">
                  <DumbbellIcon size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0">Entrenamientos por semana</h6>
                  <small className="text-secondary">
                    Tu actividad de entrenamiento en las últimas semanas
                  </small>
                </div>
              </div>

              {/* Selector segmentado de períodos */}
              <div className="progreso-filter-group">
                {FILTROS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`progreso-filter-btn ${filtroActivo === f.key ? 'active' : ''}`}
                    onClick={() => setFiltroActivo(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenedor del gráfico con cuadrícula y barras */}
            {datosSemanas.length === 0 || stats.totalEntrenamientos === 0 ? (
              <div className="text-center py-5 flex-fill d-flex flex-column align-items-center justify-content-center">
                <DumbbellIcon size={44} className="text-secondary mb-2" />
                <p className="text-secondary small mb-2">
                  Sin entrenamientos registrados en el período seleccionado.
                </p>
                <Button
                  as={Link}
                  to="/rutinas"
                  variant="outline-secondary"
                  size="sm"
                  className="border-secondary text-light"
                >
                  Ir a Rutinas
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-fill justify-content-end pt-3">
                {/* Área de barras con líneas de referencia */}
                <div className="progreso-chart-container flex-fill mb-2">
                  {/* Líneas horizontales de guía (4, 3, 2, 1, 0) */}
                  <div className="progreso-chart-grid" aria-hidden="true">
                    {[4, 3, 2, 1, 0].map((val) => (
                      <div key={val} className="d-flex align-items-center w-100">
                        <span
                          className="text-secondary me-2 text-end"
                          style={{ fontSize: '0.65rem', width: '14px' }}
                        >
                          {val}
                        </span>
                        <div className="progreso-chart-line" />
                      </div>
                    ))}
                  </div>

                  {/* Barras alineadas sobre el fondo */}
                  <div
                    className="position-relative z-1 d-flex align-items-end justify-content-around w-100 h-100 ps-4"
                    style={{ minHeight: '140px' }}
                  >
                    {datosSemanas.map((semana, idx) => {
                      const altura = Math.min(
                        100,
                        Math.max(6, (semana.cantidad / maxSemana) * 100)
                      );

                      return (
                        <div
                          key={idx}
                          className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end px-1"
                        >
                          {/* Conteo numérico superior sobre la barra */}
                          {semana.cantidad > 0 && (
                            <small
                              className="fw-bold mb-1"
                              style={{
                                color: 'var(--color-primary)',
                                fontSize: '0.72rem',
                                lineHeight: 1,
                              }}
                            >
                              {semana.cantidad}
                            </small>
                          )}
                          <div
                            className="progreso-chart-bar"
                            style={{ height: `${semana.cantidad > 0 ? altura : 6}%` }}
                            title={`${semana.label}: ${semana.cantidad} sesiones`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Etiquetas de semanas en el eje X */}
                <div className="d-flex justify-content-around w-100 ps-4 border-top border-secondary border-opacity-25 pt-2">
                  {datosSemanas.map((semana, idx) => (
                    <span
                      key={idx}
                      className="text-secondary text-center flex-fill"
                      style={{ fontSize: '0.72rem' }}
                    >
                      {semana.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* Panel: Objetivo mensual circular */}
        <Col xs={12} lg={5}>
          <Card className="progreso-goal-card h-100 shadow-sm p-4 d-flex flex-column justify-content-between">
            {/* Fotografía de fondo sutil con discos y mancuernas */}
            <img
              src="/img/rutinas/banner-rutinas.jpg"
              alt=""
              aria-hidden="true"
              className="progreso-goal-bg-img d-none d-sm-block"
            />
            <div className="progreso-goal-overlay" />

            <div className="position-relative z-1">
              {/* Encabezado */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="text-success">
                  <TargetIcon size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0">Objetivo mensual</h6>
                  <small className="text-secondary">
                    Completa {OBJETIVO_MENSUAL} sesiones este mes
                  </small>
                </div>
              </div>

              {/* Indicador circular y datos al lado */}
              <div className="d-flex align-items-center justify-content-around flex-wrap gap-3 py-2 mb-3">
                {/* SVG circular con resplandor verde */}
                <div style={{ filter: 'drop-shadow(0 0 14px rgba(158, 240, 26, 0.28))' }}>
                  <svg viewBox="0 0 120 120" width="135" height="135">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#1A2127"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - progresoMensual / 100)}`}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                    <text
                      x="60"
                      y="56"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="22"
                      fontWeight="bold"
                    >
                      {progresoMensual}%
                    </text>
                    <text
                      x="60"
                      y="72"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="10"
                    >
                      del objetivo
                    </text>
                  </svg>
                </div>

                {/* Métricas destacadas al lado */}
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="text-success">
                      <CalendarIcon size={18} />
                    </div>
                    <div>
                      <div className="fw-bold text-white small">
                        {stats.entrenamientosEsteMes} de {OBJETIVO_MENSUAL} sesiones
                      </div>
                      <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                        objetivo de este mes
                      </small>
                    </div>
                  </div>

                  {stats.caloriasTotal > 0 && (
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-danger">
                        <FlameIcon size={18} />
                      </div>
                      <div>
                        <div className="fw-bold small" style={{ color: '#ea580c' }}>
                          {stats.caloriasTotal.toLocaleString()} kcal totales
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Barra horizontal inferior de progreso */}
            <div className="position-relative z-1 pt-2">
              <ProgressBar
                now={progresoMensual}
                className="w-100"
                style={{ height: '7px', backgroundColor: 'var(--border-color)' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* ─── 4. LOGROS Y RACHA + SESIONES RECIENTES ─────────────────────────── */}
      <Row className="g-4 mb-4">
        {/* Columna Izquierda: Logros (Matriz 2x3) */}
        <Col xs={12} lg={7}>
          <Card className="forza-card border-secondary h-100 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="text-success">
                  <MedalIcon size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0">Logros</h6>
                  <small className="text-secondary">
                    Completa objetivos y desbloquea nuevas insignias
                  </small>
                </div>
              </div>
              <small className="text-secondary">
                <strong style={{ color: 'var(--color-primary)' }}>{logrosDesbloqueados}</strong> /{' '}
                {logros.length} desbloqueados
              </small>
            </div>

            {/* Matriz 2x3 de Logros */}
            <Row className="g-3">
              {logros.map((logro) => {
                const desbloqueado = logro.desbloqueado;

                return (
                  <Col xs={12} sm={6} key={logro.id}>
                    <div
                      className={`progreso-logro-card h-100 d-flex align-items-center justify-content-between gap-3 ${
                        desbloqueado ? 'is-unlocked' : 'is-locked'
                      }`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {/* Icono del logro */}
                        <div
                          className="progreso-logro-icon-wrapper"
                          style={{
                            backgroundColor: desbloqueado
                              ? 'rgba(158, 240, 26, 0.12)'
                              : 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${
                              desbloqueado ? 'rgba(158, 240, 26, 0.35)' : 'rgba(255, 255, 255, 0.1)'
                            }`,
                          }}
                        >
                          {logro.imagen ? (
                            <img
                              src={logro.imagen}
                              alt={logro.nombre}
                              loading="lazy"
                              style={{
                                width: '28px',
                                height: '28px',
                                filter: desbloqueado
                                  ? 'drop-shadow(0 0 6px rgba(158,240,26,0.5))'
                                  : 'grayscale(1) opacity(0.35)',
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <DumbbellIcon
                              size={22}
                              className={desbloqueado ? 'text-success' : 'text-secondary'}
                            />
                          )}
                        </div>

                        {/* Textos */}
                        <div>
                          <div
                            className={`fw-bold small mb-1 ${
                              desbloqueado ? 'text-white' : 'text-secondary'
                            }`}
                          >
                            {logro.nombre}
                          </div>
                          <small
                            className="text-secondary d-block"
                            style={{ fontSize: '0.72rem', lineHeight: 1.3 }}
                          >
                            {logro.descripcion}
                          </small>
                        </div>
                      </div>

                      {/* Estado: Checkmark verde o Candado gris */}
                      <div className="flex-shrink-0">
                        {desbloqueado ? (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-dark"
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: 'var(--color-primary)',
                            }}
                          >
                            <CheckIcon size={12} />
                          </div>
                        ) : (
                          <div className="text-secondary opacity-50">
                            <LockIcon size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        {/* Columna Derecha: Racha de entrenamiento + Sesiones recientes */}
        <Col xs={12} lg={5}>
          <div className="d-flex flex-column gap-3 h-100">
            {/* Panel Racha de entrenamiento */}
            <div className="progreso-streak-card shadow-sm">
              <img
                src="/img/hero-gym.webp"
                alt=""
                aria-hidden="true"
                className="progreso-streak-bg-img d-none d-sm-block"
              />
              <div className="progreso-streak-overlay" />

              <div className="position-relative z-1 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-danger flex-shrink-0"
                  style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: 'rgba(234, 88, 12, 0.15)',
                    border: '1px solid rgba(234, 88, 12, 0.3)',
                  }}
                >
                  <FlameIcon size={24} />
                </div>
                <div>
                  <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>
                    Racha de entrenamiento
                  </small>
                  <div
                    className="fw-bold"
                    style={{ color: '#fb923c', fontSize: '1.8rem', lineHeight: 1.1 }}
                  >
                    {racha} días
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    de racha activa
                  </small>
                </div>
              </div>
            </div>

            {/* Panel Sesiones recientes */}
            <Card className="forza-card border-secondary flex-fill shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="text-success">
                    <TimerIcon size={16} />
                  </div>
                  <h6 className="fw-bold text-white mb-0 small">Sesiones recientes</h6>
                </div>
                <Link
                  to="/rutinas"
                  className="text-secondary small text-decoration-none"
                  style={{ fontSize: '0.75rem' }}
                >
                  Ver historial completo →
                </Link>
              </div>

              {ultimosEntrenamientos.length === 0 ? (
                <p className="text-secondary small mb-0 py-3 text-center">
                  Sin sesiones registradas aún.
                </p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {ultimosEntrenamientos.slice(0, 4).map((ent) => (
                    <div
                      key={ent.id}
                      className="progreso-recent-item d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div className="text-success">
                          <DumbbellIcon size={15} />
                        </div>
                        <div>
                          <div className="fw-semibold text-white" style={{ fontSize: '0.8rem' }}>
                            {ent.rutinaNombre}
                          </div>
                          <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                            {formatFecha(ent.fecha)}
                          </small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                          ⏱️ {ent.duracionMinutos} min
                        </span>
                        {ent.caloriasEstimadas > 0 && (
                          <span
                            className="small fw-semibold"
                            style={{ color: '#ea580c', fontSize: '0.75rem' }}
                          >
                            🔥 {ent.caloriasEstimadas} kcal
                          </span>
                        )}
                        <span className="text-secondary opacity-50 ms-1">
                          <ChevronRightIcon size={13} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Col>
      </Row>

      {/* ─── 5. ÚLTIMAS SESIONES REGISTRADAS ─────────────────────────────────── */}
      <Card className="forza-card border-secondary shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <div className="text-success">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h6 className="fw-bold text-white mb-0">Últimas sesiones registradas</h6>
              <small className="text-secondary">
                Tus entrenamientos más recientes, con duración y calorías.
              </small>
            </div>
          </div>
          <Button
            as={Link}
            to="/rutinas"
            variant="outline-secondary"
            size="sm"
            className="border-secondary text-light btn-sm"
          >
            Ir a Rutinas
          </Button>
        </div>

        {ultimosEntrenamientos.length === 0 ? (
          <div className="text-center py-5">
            <CalendarIcon size={44} className="text-secondary mb-2" />
            <p className="text-secondary small mb-1">Todavía no registraste sesiones.</p>
            <p className="text-secondary small mb-0">
              Andá a{' '}
              <Link to="/rutinas" style={{ color: 'var(--color-primary)' }}>
                Mis Rutinas
              </Link>{' '}
              y marcá una sesión como completada para verla acá.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {ultimosEntrenamientos.map((ent) => {
              const fotoSesion = obtenerThumbnailSesion(ent.rutinaNombre);

              return (
                <div
                  key={ent.id}
                  className="progreso-session-row d-flex align-items-center justify-content-between flex-wrap gap-3"
                >
                  {/* Miniatura fotográfica + Checkmark + Nombre */}
                  <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                    <div className="position-relative">
                      <img
                        src={fotoSesion}
                        alt={ent.rutinaNombre}
                        loading="lazy"
                        className="progreso-session-thumb"
                        onError={(e) => {
                          e.currentTarget.src = '/img/hero-gym.webp';
                        }}
                      />
                      <div
                        className="position-absolute bottom-0 end-0 rounded-circle bg-success text-dark d-flex align-items-center justify-content-center"
                        style={{ width: '16px', height: '16px', transform: 'translate(25%, 25%)' }}
                      >
                        <CheckIcon size={10} />
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-white small">{ent.rutinaNombre}</div>
                      <small className="text-secondary d-flex align-items-center gap-1">
                        <CalendarIcon size={11} className="text-secondary" />
                        <span>{formatFecha(ent.fecha)}</span>
                      </small>
                    </div>
                  </div>

                  {/* Badge Completado */}
                  <div className="d-none d-sm-block">
                    <span
                      className="badge rounded-pill small px-3 py-1"
                      style={{
                        backgroundColor: 'rgba(158, 240, 26, 0.12)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(158, 240, 26, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Completado
                    </span>
                  </div>

                  {/* Separador sutil */}
                  <span className="text-secondary opacity-25 d-none d-md-inline">|</span>

                  {/* Duración y Calorías */}
                  <div className="d-flex align-items-center gap-3 ms-auto ms-sm-0">
                    <span className="text-secondary small d-flex align-items-center gap-1">
                      <TimerIcon size={14} className="text-secondary" />
                      <span>{ent.duracionMinutos} min</span>
                    </span>

                    {ent.caloriasEstimadas > 0 && (
                      <span
                        className="small d-flex align-items-center gap-1 fw-semibold"
                        style={{ color: '#ea580c' }}
                      >
                        <FlameIcon size={14} className="text-danger" />
                        <span>{ent.caloriasEstimadas} kcal</span>
                      </span>
                    )}

                    <span className="text-secondary opacity-50 ms-1">
                      <ChevronRightIcon size={15} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </Container>
  );
}

export default DashboardPage;
