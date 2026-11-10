import { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Badge,
  ProgressBar, ListGroup, ButtonGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  calcularEstadisticas,
  obtenerEntrenamientosPorPeriodo,
  obtenerEntrenamientos,
  calcularRachaActual,
  calcularLogros,
} from '../services/rutinasService';

/**
 * DashboardPage.jsx — Pantalla de Progreso (Rediseño).
 * Estadísticas reales, gráfico con filtros temporales, objetivo mensual,
 * logros desbloqueados y racha de constancia.
 */

const OBJETIVO_MENSUAL = 20;

const FILTROS = [
  { key: '1', label: '1 mes', meses: 1 },
  { key: '3', label: '3 meses', meses: 3 },
  { key: '6', label: '6 meses', meses: 6 },
  { key: '12', label: '1 año', meses: 12 },
];

function DashboardPage() {
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

  // ─── Derivados ────────────────────────────────────────────────────────────
  const progresoMensual = Math.min(100, Math.round((stats.entrenamientosEsteMes / OBJETIVO_MENSUAL) * 100));
  const diasTranscurridos = new Date().getDate() || 1;
  const porcentajeConstancia = Math.min(100, Math.round((stats.entrenamientosEsteMes / diasTranscurridos) * 100));
  const maxSemana = Math.max(...datosSemanas.map((s) => s.cantidad), 1);
  const logrosDesbloqueados = logros.filter((l) => l.desbloqueado).length;

  const formatFecha = (iso) => new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'short', day: '2-digit', month: 'short',
  });

  return (
    <Container className="py-2">

      {/* ─── ENCABEZADO Y BANNER DE PROGRESO ─────────────────────────────────── */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden border border-secondary"
        style={{ backgroundColor: '#080B0D', minHeight: '190px' }}
      >
        {/* Fotografía profesional de fondo integrada a la derecha */}
        <img
          src="/img/progreso/banner-progreso.jpg"
          alt="Progreso y rendimiento FORZA"
          loading="lazy"
          className="position-absolute top-0 end-0 h-100 d-none d-md-block"
          style={{
            width: '46%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.65) contrast(1.15)',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        {/* Degradado oscuro para que el texto resalte con nitidez */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to right, #080B0D 0%, #080B0D 48%, rgba(8, 11, 13, 0.88) 68%, rgba(8, 11, 13, 0.25) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="position-relative z-1 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div
              className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-2 small fw-bold"
              style={{ background: 'rgba(158, 240, 26, 0.12)', color: 'var(--color-primary)', border: '1px solid rgba(158, 240, 26, 0.25)' }}
            >
              📈 Panel de Rendimiento y Estadísticas
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">
              Mi <span style={{ color: 'var(--color-primary)' }}>Progreso</span>
            </h1>
            <p className="text-secondary mb-0 col-md-9" style={{ fontSize: '0.95rem' }}>
              Seguimiento de tus entrenamientos, rachas de constancia, objetivos alcanzados y logros.
            </p>
          </div>
          <Button as={Link} to="/rutinas/nueva" className="forza-btn-primary">
            + Nueva Rutina
          </Button>
        </div>
      </div>

      {/* ─── 4 TARJETAS DE ESTADÍSTICAS ───────────────────────────────────── */}
      <Row className="g-3 mb-4">
        {[
          {
            emoji: '🏆', valor: stats.totalEntrenamientos,
            label: 'Sesiones totales', sub: 'registradas',
            color: 'var(--color-primary)',
          },
          {
            emoji: '📈', valor: `${porcentajeConstancia}%`,
            label: 'Constancia', sub: 'este mes',
            color: '#7c3aed',
          },
          {
            emoji: '⏱️', valor: stats.duracionTotal > 0 ? `${stats.duracionTotal}m` : '0m',
            label: 'Tiempo total', sub: 'acumulado',
            color: '#0ea5e9',
          },
          {
            emoji: '🔥', valor: `${racha} días`,
            label: 'Racha actual', sub: 'consecutivos',
            color: '#ea580c',
          },
        ].map((s, i) => (
          <Col key={i} xs={6} sm={6} lg={3}>
            <Card className="forza-card border-secondary h-100">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center fs-3 flex-shrink-0"
                  style={{ width: '50px', height: '50px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}
                >
                  {s.emoji}
                </div>
                <div>
                  <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                    {s.label}
                  </small>
                  <div className="fw-bold" style={{ color: s.color, fontSize: '1.4rem', lineHeight: 1.1 }}>
                    {s.valor}
                  </div>
                  <small className="text-secondary" style={{ fontSize: '0.72rem' }}>{s.sub}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ─── GRÁFICO SEMANAL + OBJETIVO MENSUAL ───────────────────────────── */}
      <Row className="g-4 mb-4">

        {/* Gráfico de barras con filtro temporal */}
        <Col lg={7}>
          <Card className="forza-card border-secondary h-100">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <h6 className="fw-bold text-light mb-0">Entrenamientos por semana</h6>
                {/* Filtros de período */}
                <ButtonGroup size="sm">
                  {FILTROS.map((f) => (
                    <Button
                      key={f.key}
                      variant={filtroActivo === f.key ? 'success' : 'outline-secondary'}
                      className="border-secondary"
                      style={
                        filtroActivo === f.key
                          ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#080B0D', fontWeight: 700 }
                          : { color: 'var(--text-secondary)' }
                      }
                      onClick={() => setFiltroActivo(f.key)}
                    >
                      {f.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              {/* Barras del gráfico */}
              {datosSemanas.length === 0 || stats.totalEntrenamientos === 0 ? (
                <div className="text-center py-4 flex-fill d-flex flex-column align-items-center justify-content-center">
                  <span className="fs-1 mb-2">📊</span>
                  <p className="text-secondary small mb-2">
                    Sin datos en el período seleccionado.
                  </p>
                  <Button as={Link} to="/rutinas" variant="outline-secondary" size="sm" className="border-secondary text-light">
                    Ir a Rutinas
                  </Button>
                </div>
              ) : (
                <div
                  className="d-flex align-items-end gap-1 flex-fill"
                  style={{ minHeight: '150px', paddingBottom: '0.25rem' }}
                >
                  {datosSemanas.map((semana, idx) => {
                    const altura = Math.max(8, (semana.cantidad / maxSemana) * 100);
                    return (
                      <div
                        key={idx}
                        className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end"
                      >
                        <small
                          className="fw-bold mb-1"
                          style={{ color: semana.cantidad > 0 ? 'var(--color-primary)' : 'transparent', fontSize: '0.7rem', minHeight: '14px' }}
                        >
                          {semana.cantidad > 0 ? semana.cantidad : ''}
                        </small>
                        <div
                          className="w-100 d-flex align-items-end overflow-hidden"
                          style={{ height: '120px', maxWidth: '32px', background: 'var(--bg-main)', borderRadius: '4px 4px 0 0' }}
                        >
                          <div
                            className="w-100"
                            style={{
                              height: `${altura}%`,
                              background: 'linear-gradient(to top, var(--color-primary), rgba(158,240,26,0.4))',
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.5s ease',
                            }}
                          />
                        </div>
                        <small className="text-secondary mt-1" style={{ fontSize: '0.62rem', whiteSpace: 'nowrap' }}>
                          {semana.label}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Objetivo mensual circular */}
        <Col lg={5}>
          <Card className="forza-card border-secondary h-100">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="d-flex align-items-center gap-2 mb-3">
                <img
                  src="/img/progreso/meta-mensual.svg"
                  alt="Meta"
                  style={{ width: '22px', height: '22px' }}
                />
                <h6 className="fw-bold text-light mb-0">Objetivo mensual</h6>
              </div>

              {/* SVG circular */}
              <div style={{ filter: 'drop-shadow(0 0 16px rgba(158,240,26,0.2))' }}>
                <svg viewBox="0 0 120 120" width="140" height="140">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border-color)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="48" fill="none"
                    stroke="var(--color-primary)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - progresoMensual / 100)}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                  <text x="60" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold">
                    {progresoMensual}%
                  </text>
                  <text x="60" y="72" textAnchor="middle" fill="#A7ADB4" fontSize="10">
                    del objetivo
                  </text>
                </svg>
              </div>

              <div className="fw-bold text-light mt-2 mb-1">
                {stats.entrenamientosEsteMes} de {OBJETIVO_MENSUAL} sesiones
              </div>
              <small className="text-secondary mb-3">objetivo de este mes</small>

              <ProgressBar
                now={progresoMensual}
                className="w-100"
                style={{ height: '7px', backgroundColor: 'var(--border-color)' }}
              />

              {/* Calorías extra si hay datos */}
              {stats.caloriasTotal > 0 && (
                <div
                  className="mt-3 p-2 rounded-3 w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.25)' }}
                >
                  <span>🔥</span>
                  <span className="small fw-bold" style={{ color: '#ea580c' }}>
                    {stats.caloriasTotal.toLocaleString()} kcal totales
                  </span>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── LOGROS Y RACHA ───────────────────────────────────────────────── */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="forza-card border-secondary">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-light mb-0">Logros</h6>
                <small className="text-secondary">
                  <span style={{ color: 'var(--color-primary)' }}>{logrosDesbloqueados}</span>
                  {' '}/ {logros.length} desbloqueados
                </small>
              </div>
              <Row className="g-3">
                {logros.map((logro) => (
                  <Col xs={6} sm={4} key={logro.id}>
                    <div
                      className="p-3 rounded-3 text-center border h-100 d-flex flex-column align-items-center justify-content-between"
                      style={{
                        background: logro.desbloqueado
                          ? 'rgba(158,240,26,0.08)'
                          : 'var(--bg-main)',
                        borderColor: logro.desbloqueado
                          ? 'rgba(158,240,26,0.35)'
                          : 'var(--border-color)',
                        opacity: logro.desbloqueado ? 1 : 0.45,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div className="mb-2" style={{ width: '52px', height: '52px' }}>
                        {logro.imagen ? (
                          <img
                            src={logro.imagen}
                            alt={logro.nombre}
                            loading="lazy"
                            className="w-100 h-100"
                            style={{
                              filter: logro.desbloqueado
                                ? 'drop-shadow(0 0 10px rgba(158,240,26,0.4))'
                                : 'grayscale(1) opacity(0.55)',
                              transition: 'all 0.3s ease',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="fs-2">{logro.emoji}</div>
                        )}
                      </div>
                      <div>
                        <div className="fw-bold text-light mb-1" style={{ fontSize: '0.8rem' }}>
                          {logro.nombre}
                        </div>
                        <small className="text-secondary d-block" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
                          {logro.descripcion}
                        </small>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Racha + últimas sesiones */}
        <Col lg={4}>
          <Card className="forza-card border-secondary h-100">
            <Card.Body className="p-4 d-flex flex-column">
              {/* Racha con llama visual deportiva */}
              <div
                className="text-center p-3 rounded-3 mb-4 position-relative overflow-hidden"
                style={{
                  background: racha > 0 ? 'rgba(234,88,12,0.08)' : 'var(--bg-main)',
                  border: `1px solid ${racha > 0 ? 'rgba(234,88,12,0.35)' : 'var(--border-color)'}`,
                }}
              >
                <div className="mb-2 d-flex justify-content-center">
                  <img
                    src="/img/progreso/fuego-racha.svg"
                    alt="Racha"
                    loading="lazy"
                    style={{
                      width: '56px',
                      height: '56px',
                      filter: racha > 0 ? 'drop-shadow(0 0 12px rgba(234,88,12,0.55))' : 'grayscale(1) opacity(0.4)',
                    }}
                  />
                </div>
                <div className="fw-bold" style={{ color: '#ea580c', fontSize: '2.2rem', lineHeight: 1 }}>
                  {racha}
                </div>
                <small className="text-secondary fw-semibold">días de racha activa</small>
              </div>

              {/* Top 3 recientes */}
              <h6 className="fw-bold text-light mb-3 small">Sesiones recientes</h6>
              {ultimosEntrenamientos.length === 0 ? (
                <p className="text-secondary small mb-0">Sin sesiones registradas.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {ultimosEntrenamientos.slice(0, 4).map((ent) => (
                    <div
                      key={ent.id}
                      className="d-flex justify-content-between align-items-center p-2 rounded-3 border border-secondary"
                      style={{ background: 'var(--bg-main)', fontSize: '0.8rem' }}
                    >
                      <div>
                        <div className="fw-semibold text-light" style={{ fontSize: '0.78rem' }}>
                          {ent.rutinaNombre}
                        </div>
                        <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                          {formatFecha(ent.fecha)}
                        </small>
                      </div>
                      <span className="text-secondary" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                        ⏱️ {ent.duracionMinutos}m
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Link al historial completo */}
              <div className="mt-auto pt-3">
                <Button
                  as={Link}
                  to="/rutinas"
                  variant="outline-secondary"
                  size="sm"
                  className="w-100 border-secondary text-light"
                  onClick={() => {
                    // El tab de historial se activa desde RutinaPage
                    sessionStorage.setItem('forza_tab', 'historial');
                  }}
                >
                  Ver historial completo →
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── LISTADO COMPLETO DE SESIONES ─────────────────────────────────── */}
      <Card className="forza-card border-secondary">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-light mb-0">Últimas sesiones registradas</h6>
            <Button as={Link} to="/rutinas" variant="outline-secondary" size="sm" className="border-secondary text-light">
              Ir a Rutinas
            </Button>
          </div>

          {ultimosEntrenamientos.length === 0 ? (
            <div className="text-center py-4">
              <span className="fs-2 d-block mb-2">📋</span>
              <p className="text-secondary small mb-1">Todavía no registraste sesiones.</p>
              <p className="text-secondary small mb-0">
                Andá a{' '}
                <Link to="/rutinas" style={{ color: 'var(--color-primary)' }}>
                  Mis Rutinas
                </Link>{' '}
                y marcá una sesión como completada.
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {ultimosEntrenamientos.map((ent) => (
                <ListGroup.Item
                  key={ent.id}
                  className="d-flex justify-content-between align-items-center border-secondary rounded-3 mb-2 p-3"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px', background: 'rgba(158,240,26,0.1)', fontSize: '1.1rem', flexShrink: 0 }}
                    >
                      ✅
                    </div>
                    <div>
                      <div className="fw-bold small text-light">{ent.rutinaNombre}</div>
                      <small className="text-secondary">{formatFecha(ent.fecha)}</small>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge bg="dark" className="border border-secondary text-secondary">
                      ⏱️ {ent.duracionMinutos} min
                    </Badge>
                    {ent.caloriasEstimadas > 0 && (
                      <Badge bg="dark" className="border border-secondary" style={{ color: '#ea580c' }}>
                        🔥 {ent.caloriasEstimadas} kcal
                      </Badge>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DashboardPage;
