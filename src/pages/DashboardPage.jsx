import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  calcularEstadisticas,
  obtenerEntrenamientosPorSemana,
  obtenerEntrenamientos,
} from '../services/rutinasService';

const OBJETIVO_MENSUAL = 20;

/**
 * Pantalla 3 — Progreso y Panel de Control (Diseño A).
 * Construida con 90% utilidades y componentes nativos de Bootstrap 5.
 */
function DashboardPage() {
  const [stats, setStats] = useState({
    totalEntrenamientos: 0,
    entrenamientosEsteMes: 0,
    duracionTotal: 0,
    duracionPromedio: 0,
  });
  const [datosSemanas, setDatosSemanas] = useState([]);
  const [ultimosEntrenamientos, setUltimosEntrenamientos] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = () => {
    const estadisticas = calcularEstadisticas();
    const semanas = obtenerEntrenamientosPorSemana();
    const entrenamientos = obtenerEntrenamientos();

    setStats(estadisticas);
    setDatosSemanas(semanas);

    const ultimos = [...entrenamientos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5);
    setUltimosEntrenamientos(ultimos);
  };

  const diasTranscurridos = new Date().getDate() || 1;
  const porcentajeConstancia = Math.min(
    100,
    Math.round((stats.entrenamientosEsteMes / diasTranscurridos) * 100)
  );

  const progresoMensual = Math.min(
    100,
    Math.round((stats.entrenamientosEsteMes / OBJETIVO_MENSUAL) * 100)
  );

  const maxSemana = Math.max(...datosSemanas.map((s) => s.cantidad), 1);

  const formatearFecha = (isoString) => {
    const f = new Date(isoString);
    return f.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      weekday: 'short',
    });
  };

  return (
    <Container className="py-2">
      {/* ─── ENCABEZADO ─── */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold text-light mb-1">Progreso</h1>
          <p className="text-secondary small mb-0">Seguimiento de tus entrenamientos y constancia.</p>
        </div>
        <Button as={Link} to="/rutinas" className="forza-btn-primary btn-sm">
          + Nueva Rutina
        </Button>
      </div>

      {/* ─── 3 TARJETAS DE ESTADÍSTICAS (Bootstrap Row + Col + Card) ─── */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="forza-card border-secondary">
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div 
                className="rounded-3 bg-black border border-secondary d-flex align-items-center justify-content-center fs-3 flex-shrink-0"
                style={{ width: '50px', height: '50px' }}
              >
                📅
              </div>
              <div>
                <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Entrenamientos
                </small>
                <div className="h3 fw-bold text-light mb-0">{stats.totalEntrenamientos}</div>
                <small className="text-secondary" style={{ fontSize: '0.75rem' }}>sesiones registradas</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="forza-card border-secondary">
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div 
                className="rounded-3 bg-black border border-secondary d-flex align-items-center justify-content-center fs-3 flex-shrink-0"
                style={{ width: '50px', height: '50px' }}
              >
                📈
              </div>
              <div>
                <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Constancia
                </small>
                <div className="h3 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {porcentajeConstancia}%
                </div>
                <small className="text-secondary" style={{ fontSize: '0.75rem' }}>este mes</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={4}>
          <Card className="forza-card border-secondary">
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div 
                className="rounded-3 bg-black border border-secondary d-flex align-items-center justify-content-center fs-3 flex-shrink-0"
                style={{ width: '50px', height: '50px' }}
              >
                ⏱️
              </div>
              <div>
                <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Duración total
                </small>
                <div className="h3 fw-bold text-light mb-0">
                  {stats.duracionTotal > 0 ? `${stats.duracionTotal}m` : '0m'}
                </div>
                <small className="text-secondary" style={{ fontSize: '0.75rem' }}>tiempo registrado</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── GRÁFICO SEMANAL + OBJETIVO MENSUAL (Grilla Bootstrap) ─── */}
      <Row className="g-4 mb-4">
        {/* Gráfico semanal hecho con Bootstrap Flexbox */}
        <Col lg={7}>
          <Card className="forza-card border-secondary h-100">
            <Card.Body className="p-4 d-flex flex-column">
              <h5 className="fw-bold text-light mb-3">Entrenamientos por semana</h5>

              <div className="d-flex align-items-end justify-content-around text-center pt-3 flex-fill" style={{ minHeight: '170px' }}>
                {datosSemanas.map((semana, idx) => {
                  const altura = maxSemana > 0 ? Math.max(12, (semana.cantidad / maxSemana) * 100) : 12;
                  return (
                    <div key={idx} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end px-1">
                      <small className="fw-bold mb-1" style={{ color: 'var(--color-primary)', minHeight: '18px' }}>
                        {semana.cantidad > 0 ? semana.cantidad : ''}
                      </small>
                      <div className="w-100 bg-black rounded-top d-flex align-items-end overflow-hidden" style={{ maxWidth: '42px', height: '120px' }}>
                        <div
                          className="w-100 rounded-top"
                          style={{
                            height: `${altura}%`,
                            background: 'linear-gradient(to top, var(--color-primary), rgba(158, 240, 26, 0.45))',
                            transition: 'height 0.4s ease',
                          }}
                        />
                      </div>
                      <small className="text-secondary mt-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                        {semana.label}
                      </small>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Objetivo mensual con Círculo SVG + ProgressBar Bootstrap */}
        <Col lg={5}>
          <Card className="forza-card border-secondary h-100">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <h5 className="fw-bold text-light mb-3">Objetivo mensual</h5>

              <div className="my-2 position-relative" style={{ width: '130px', height: '130px' }}>
                <svg viewBox="0 0 120 120" width="130" height="130">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border-color)" strokeWidth="10" />
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
                  <text x="60" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold">
                    {progresoMensual}%
                  </text>
                  <text x="60" y="74" textAnchor="middle" fill="#A7ADB4" fontSize="10">
                    alcanzado
                  </text>
                </svg>
              </div>

              <div className="text-light fw-bold mt-2">
                {stats.entrenamientosEsteMes} de {OBJETIVO_MENSUAL} entrenamientos
              </div>
              <small className="text-secondary mb-3">Meta del mes actual</small>

              <ProgressBar
                now={progresoMensual}
                className="w-100"
                style={{ height: '7px', backgroundColor: 'var(--border-color)' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── HISTORIAL CON LISTGROUP DE BOOTSTRAP ─── */}
      <Card className="forza-card border-secondary">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-light mb-0">Últimos entrenamientos completados</h5>
            <Button as={Link} to="/rutinas" variant="outline-secondary" size="sm" className="border-secondary text-light">
              Ir a Rutinas
            </Button>
          </div>

          {ultimosEntrenamientos.length === 0 ? (
            <p className="text-secondary small mb-0 py-2">
              Aún no registraste entrenamientos. Andá a{' '}
              <Link to="/rutinas" style={{ color: 'var(--color-primary)' }}>
                Mis Rutinas
              </Link>{' '}
              y tocá &quot;Marcar completado&quot;.
            </p>
          ) : (
            <ListGroup variant="flush">
              {ultimosEntrenamientos.map((ent) => (
                <ListGroup.Item
                  key={ent.id}
                  className="bg-black text-light border-secondary rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-5">✅</span>
                    <div>
                      <div className="fw-bold small text-light">{ent.rutinaNombre}</div>
                      <small className="text-secondary">{formatearFecha(ent.fecha)}</small>
                    </div>
                  </div>
                  <span className="badge bg-dark text-secondary border border-secondary">
                    ⏱️ {ent.duracionMinutos} min
                  </span>
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
