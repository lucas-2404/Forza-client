import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav } from 'react-bootstrap';
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

/**
 * RutinaPage.jsx — Pantalla 1 del módulo de Rutinas (Rediseño).
 * Incluye tabs: Mis Rutinas | Recomendadas | Historial.
 */

const ETIQUETAS_DIAS = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

function RutinaPage() {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([]);
  const [stats, setStats] = useState({ totalRutinas: 0, entrenamientosSemanales: 0, duracionPromedio: 45 });
  const [historial, setHistorial] = useState([]);
  const [racha, setRacha] = useState(0);
  const [tabActivo, setTabActivo] = useState('mis-rutinas');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setRutinas(obtenerRutinas());
    setStats(calcularEstadisticas());
    setHistorial([...obtenerEntrenamientos()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    setRacha(calcularRachaActual());
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
      Swal.fire({ title: 'Eliminada', icon: 'success', timer: 1500, showConfirmButton: false, background: '#171C20', color: '#fff' });
    }
  };

  const handleAbrir = (rutina) => navigate(`/rutinas/${rutina.id}`);

  const handleCompletar = async (rutina) => {
    const { value: duracion } = await Swal.fire({
      title: `Registrar sesión`,
      html: `
        <p class="text-secondary small mb-2">Rutina: <strong class="text-light">${rutina.nombre}</strong></p>
        <label class="text-secondary small d-block mb-1">Duración en minutos:</label>
        <input id="swal-duracion" type="number" min="1" max="300" value="${rutina.duracionMin || 45}"
          class="form-control bg-dark text-light border-secondary text-center mx-auto" style="max-width:120px">
      `,
      showCancelButton: true,
      confirmButtonText: '✅ Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
      preConfirm: () => {
        const v = parseInt(document.getElementById('swal-duracion').value, 10);
        if (!v || v <= 0) { Swal.showValidationMessage('Duración inválida.'); return false; }
        return v;
      },
    });

    if (duracion) {
      const res = registrarEntrenamiento(rutina.id, rutina.nombre, duracion);
      if (res === null) {
        Swal.fire({ title: 'Ya registrada hoy', text: 'Ya anotaste esta rutina hoy.', icon: 'info', background: '#171C20', color: '#fff', confirmButtonColor: '#9EF01A' });
      } else {
        Swal.fire({ title: '¡Excelente!', text: `${duracion} min registrados correctamente.`, icon: 'success', timer: 2000, showConfirmButton: false, background: '#171C20', color: '#fff' });
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
      // Agregar al localStorage con los datos de la recomendada
      agregarRutina({
        nombre: rutina.nombre,
        objetivo: rutina.objetivo,
        diasSeleccionados: rutina.diasSeleccionados,
        dias: rutina.dias,
        grupos: rutina.grupos,
        duracionMin: rutina.duracionMin,
        nivel: rutina.nivel,
      });
      cargarDatos();
      setTabActivo('mis-rutinas');
      Swal.fire({ title: '¡Rutina agregada!', text: 'Ya aparece en Mis Rutinas.', icon: 'success', timer: 1800, showConfirmButton: false, background: '#171C20', color: '#fff' });
    }
  };

  const formatFecha = (iso) => {
    const f = new Date(iso);
    return f.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  return (
    <Container className="py-2">
      {/* ─── HERO BANNER CON FOTOGRAFÍA DEPORTIVA ─────────────────────────── */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden border border-secondary"
        style={{
          backgroundColor: '#080B0D',
          minHeight: '230px',
        }}
      >
        {/* Fotografía deportiva integrada a la derecha (Diseño A) */}
        <img
          src="/img/rutinas/banner-rutinas.jpg"
          alt="Atleta entrenando FORZA"
          loading="lazy"
          className="position-absolute top-0 end-0 h-100 d-none d-md-block"
          style={{
            width: '54%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.68) contrast(1.18)',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Degradado oscuro para que el texto se lea perfectamente */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to right, #080B0D 0%, #080B0D 42%, rgba(8, 11, 13, 0.88) 65%, rgba(8, 11, 13, 0.25) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Efecto de luz verde lima */}
        <div
          className="position-absolute"
          style={{
            top: 0,
            right: '25%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(158, 240, 26, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Row className="align-items-center position-relative z-1">
          <Col md={8} lg={7}>
            <div
              className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-3 small fw-bold"
              style={{
                background: 'rgba(158, 240, 26, 0.14)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(158, 240, 26, 0.3)',
                backdropFilter: 'blur(4px)',
              }}
            >
              ⚡ Módulo de Entrenamiento
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">
              Mis <span style={{ color: 'var(--color-primary)' }}>Rutinas</span>
            </h1>
            <p className="text-secondary mb-4 col-lg-11" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
              Organizá tus entrenamientos, creá rutinas semanales y alcanzá tus objetivos con constancia y disciplina.
            </p>
            <Button className="forza-btn-primary" onClick={() => navigate('/rutinas/nueva')}>
              + Crear nueva rutina
            </Button>
          </Col>
        </Row>
      </div>

      {/* ─── TARJETAS DE ESTADÍSTICAS ─────────────────────────────────────────── */}
      <Row className="g-3 mb-4">
        {[
          { emoji: '📅', valor: stats.totalRutinas, label: 'Rutinas activas', color: 'var(--color-primary)' },
          { emoji: '⚡', valor: stats.entrenamientosSemanales, label: 'Sesiones esta semana', color: '#7c3aed' },
          { emoji: '⏱️', valor: `${stats.duracionPromedio} min`, label: 'Duración promedio', color: '#0ea5e9' },
          { emoji: '🔥', valor: `${racha} días`, label: 'Racha actual', color: '#ea580c' },
        ].map((s, i) => (
          <Col key={i} xs={6} sm={6} lg={3}>
            <Card className="forza-card border-secondary h-100">
              <Card.Body className="p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center fs-4 flex-shrink-0"
                  style={{ width: '46px', height: '46px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}
                >
                  {s.emoji}
                </div>
                <div>
                  <div className="fw-bold" style={{ color: s.color, fontSize: '1.3rem', lineHeight: 1 }}>
                    {s.valor}
                  </div>
                  <small className="text-secondary">{s.label}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ─── NAVEGACIÓN POR TABS ───────────────────────────────────────────────── */}
      <Tab.Container activeKey={tabActivo} onSelect={(k) => setTabActivo(k)}>
        <Nav
          className="mb-4 p-1 rounded-3 border border-secondary d-flex gap-1"
          style={{ background: 'var(--bg-card)' }}
        >
          {[
            { key: 'mis-rutinas', label: 'Mis Rutinas', count: rutinas.length },
            { key: 'recomendadas', label: 'Recomendadas', count: RUTINAS_RECOMENDADAS.length },
            { key: 'historial', label: 'Historial', count: historial.length },
          ].map((tab) => (
            <Nav.Item key={tab.key} className="flex-fill">
              <Nav.Link
                eventKey={tab.key}
                className="text-center rounded-2 fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 border-0"
                style={{
                  background: tabActivo === tab.key ? 'var(--color-primary)' : 'transparent',
                  color: tabActivo === tab.key ? '#080B0D' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge
                    className="rounded-pill"
                    style={{
                      background: tabActivo === tab.key ? 'rgba(0,0,0,0.25)' : 'var(--bg-main)',
                      color: tabActivo === tab.key ? '#080B0D' : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      border: tabActivo === tab.key ? 'none' : '1px solid var(--border-color)',
                    }}
                  >
                    {tab.count}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          {/* ─── TAB: MIS RUTINAS ─── */}
          <Tab.Pane eventKey="mis-rutinas">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-light mb-0">Mis rutinas personalizadas</h5>
              <Button className="forza-btn-primary btn-sm" onClick={() => navigate('/rutinas/nueva')}>
                + Crear rutina
              </Button>
            </div>

            {rutinas.length === 0 ? (
              <Card className="forza-card text-center py-5 border-secondary">
                <Card.Body>
                  <div className="display-4 mb-3">🏋️‍♂️</div>
                  <h5 className="text-light mb-2">Todavía no creaste rutinas</h5>
                  <p className="text-secondary small mb-4">Creá tu primer plan o agregá una de las rutinas recomendadas.</p>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button className="forza-btn-primary btn-sm" onClick={() => navigate('/rutinas/nueva')}>
                      + Crear rutina
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="border-secondary text-light" onClick={() => setTabActivo('recomendadas')}>
                      Ver recomendadas
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-3">
                {rutinas.map((rutina) => (
                  <Col xs={12} sm={6} xl={4} key={rutina.id}>
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
          </Tab.Pane>

          {/* ─── TAB: RECOMENDADAS ─── */}
          <Tab.Pane eventKey="recomendadas">
            <div className="mb-3">
              <h5 className="fw-bold text-light mb-1">Rutinas recomendadas</h5>
              <p className="text-secondary small mb-0">Programas de entrenamiento listos para usar. Podés agregarlos a tus rutinas personales.</p>
            </div>
            <Row className="g-3">
              {RUTINAS_RECOMENDADAS.map((rutina) => {
                const yaAgregada = rutinas.some((r) => r.nombre === rutina.nombre);
                const grupos = rutina.grupos || [];
                return (
                  <Col xs={12} sm={6} xl={4} key={rutina.id}>
                    <Card className="forza-card border-secondary h-100 overflow-hidden">
                      {/* Cabecera con gradiente */}
                      <div
                        className="d-flex align-items-end p-3 position-relative"
                        style={{ height: '140px', background: rutina.colorGradient || 'linear-gradient(135deg, #0D1114, #131a0a)' }}
                      >
                        <div
                          className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                          style={{ width: '80px', height: '80px', fontSize: '3rem', opacity: 0.2 }}
                        >
                          {rutina.emoji}
                        </div>
                        <div className="position-relative">
                          <h5 className="fw-bold text-white mb-0">{rutina.nombre}</h5>
                          <small className="text-white-50">{rutina.nivel}</small>
                        </div>
                      </div>

                      <Card.Body className="d-flex flex-column p-3">
                        <p className="text-secondary small mb-3">{rutina.descripcion}</p>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {grupos.map((g) => (
                            <Badge key={g} bg="dark" className="text-secondary border border-secondary small">{g}</Badge>
                          ))}
                        </div>

                        <div className="d-flex justify-content-between text-secondary small mb-3">
                          <span>📅 {rutina.diasSemana} días/sem</span>
                          <span>⏱️ {rutina.duracionMin} min</span>
                        </div>

                        <div className="mt-auto d-flex gap-2">
                          <Button
                            className="forza-btn-primary btn-sm flex-fill"
                            onClick={() => navigate(`/rutinas/${rutina.id}`)}
                          >
                            Ver detalle
                          </Button>
                          <Button
                            variant={yaAgregada ? 'outline-secondary' : 'outline-secondary'}
                            size="sm"
                            className="border-secondary"
                            style={{ color: yaAgregada ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                            onClick={() => !yaAgregada && handleAgregarRecomendada(rutina)}
                            disabled={yaAgregada}
                          >
                            {yaAgregada ? '✓ Agregada' : '+ Usar'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Tab.Pane>

          {/* ─── TAB: HISTORIAL ─── */}
          <Tab.Pane eventKey="historial">
            <div className="mb-3">
              <h5 className="fw-bold text-light mb-1">Historial de entrenamientos</h5>
              <p className="text-secondary small mb-0">Registro de todas tus sesiones completadas.</p>
            </div>

            {historial.length === 0 ? (
              <Card className="forza-card text-center py-5 border-secondary">
                <Card.Body>
                  <div className="display-4 mb-3">📋</div>
                  <h5 className="text-light mb-2">Sin historial todavía</h5>
                  <p className="text-secondary small mb-3">Completá sesiones de entrenamiento para verlas acá.</p>
                </Card.Body>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-2">
                {historial.map((ent) => (
                  <div
                    key={ent.id}
                    className="d-flex justify-content-between align-items-center p-3 rounded-3 border border-secondary"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', background: 'rgba(158,240,26,0.1)', fontSize: '1.2rem', flexShrink: 0 }}
                      >
                        ✅
                      </div>
                      <div>
                        <div className="fw-bold small text-light">{ent.rutinaNombre}</div>
                        <small className="text-secondary">{formatFecha(ent.fecha)}</small>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1">
                      <Badge bg="dark" className="border border-secondary text-secondary small">
                        ⏱️ {ent.duracionMinutos} min
                      </Badge>
                      {ent.caloriasEstimadas > 0 && (
                        <Badge bg="dark" className="border border-secondary small" style={{ color: '#ea580c' }}>
                          🔥 {ent.caloriasEstimadas} kcal
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default RutinaPage;
