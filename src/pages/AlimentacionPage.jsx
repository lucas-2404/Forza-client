import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Badge } from 'react-bootstrap';

// Datos de demostración de FORZA Nutrition
import {
  comidasDelDia,
  estadisticasNutricionales,
  tipsNutricionales,
  planSemanal,
} from '../data/alimentacionData';

// Componentes reutilizables del módulo
import NutritionStatCard from '../components/alimentacion/NutritionStatCard';
import MealItemCard from '../components/alimentacion/MealItemCard';
import CalorieGoalCard from '../components/alimentacion/CalorieGoalCard';
import NutritionTipsCard from '../components/alimentacion/NutritionTipsCard';

// Meta calórica diaria fijada para la demo
const META_CALORICA = 2200;

// Lista de días para el selector interactivo del Plan Semanal
const DIAS_SEMANA = [
  { clave: 'Lunes', etiquetaCorta: 'Lun' },
  { clave: 'Martes', etiquetaCorta: 'Mar' },
  { clave: 'Miércoles', etiquetaCorta: 'Mié' },
  { clave: 'Jueves', etiquetaCorta: 'Jue' },
  { clave: 'Viernes', etiquetaCorta: 'Vie' },
  { clave: 'Sábado', etiquetaCorta: 'Sáb' },
  { clave: 'Domingo', etiquetaCorta: 'Dom' },
];

/**
 * AlimentacionPage — FORZA Nutrition 2.0
 *
 * Módulo de Nutrición Deportiva con diseño premium, fotografías reales en lugar
 * de emojis en estadísticas y plan semanal, interactividad en tiempo real y persistencia local.
 */
function AlimentacionPage() {
  // ─── 1. Estado de comidas consumidas (persiste en localStorage) ────────────
  const [comidasConsumidasIds, setComidasConsumidasIds] = useState(() => {
    try {
      const guardado = localStorage.getItem('forza_alimentacion');
      return guardado ? JSON.parse(guardado) : comidasDelDia.map((c) => c.id);
    } catch {
      return comidasDelDia.map((c) => c.id);
    }
  });

  // ─── 2. Estado de hidratación en litros (persiste en localStorage) ─────────
  const [hidratacion, setHidratacion] = useState(() => {
    try {
      const guardado = localStorage.getItem('forza_hidratacion');
      return guardado ? Number(JSON.parse(guardado)) : 2.1;
    } catch {
      return 2.1;
    }
  });

  // ─── 3. Comida seleccionada para el Modal de Ficha Nutricional ─────────────
  const [modalComida, setModalComida] = useState(null);

  // ─── 4. Modal de Plan Semanal y Día Activo ─────────────────────────────────
  const [showPlanSemanal, setShowPlanSemanal] = useState(false);
  const [diaSemanalSeleccionado, setDiaSemanalSeleccionado] = useState('Martes');

  // ─── Sincronización continua con localStorage ─────────────────────────────
  useEffect(() => {
    localStorage.setItem('forza_alimentacion', JSON.stringify(comidasConsumidasIds));
  }, [comidasConsumidasIds]);

  useEffect(() => {
    localStorage.setItem('forza_hidratacion', JSON.stringify(hidratacion));
  }, [hidratacion]);

  // ─── Cálculo reactivo de calorías consumidas ─────────────────────────────
  const caloriasConsumidas = comidasDelDia
    .filter((comida) => comidasConsumidasIds.includes(comida.id))
    .reduce((suma, comida) => suma + comida.calorias, 0);

  // ─── Controladores de interacción ─────────────────────────────────────────
  const toggleComidaConsumida = (id) => {
    setComidasConsumidasIds((prev) =>
      prev.includes(id) ? prev.filter((comidaId) => comidaId !== id) : [...prev, id]
    );
  };

  // Incrementos coherentes de 250 ml (0.25 L)
  const agregarAgua = () => {
    setHidratacion((prev) => Math.min(5, parseFloat((prev + 0.25).toFixed(2))));
  };

  const quitarAgua = () => {
    setHidratacion((prev) => Math.max(0, parseFloat((prev - 0.25).toFixed(2))));
  };

  // Representación gráfica de 10 vasos de 250 ml (meta diaria de 2.5 L)
  const vasosAguaTotal = 10;
  const vasosLlenos = Math.min(vasosAguaTotal, Math.floor(hidratacion / 0.25));

  // Array de comidas del día seleccionado en el Plan Semanal
  const comidasDelDiaSeleccionado = planSemanal[diaSemanalSeleccionado] || [];

  return (
    <Container fluid className="px-0">
      {/* ====================================================================
          A. HERO GASTRONÓMICO PREMIUM
          ==================================================================== */}
      <section
        className="alimentacion-hero mb-4 mb-md-5 p-4 p-md-5 d-flex align-items-center shadow-lg"
        aria-label="Encabezado de nutrición"
      >
        <div className="alimentacion-hero__content col-12 col-lg-8">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill forza-badge mb-3">
            <span aria-hidden="true">🥗</span>
            <span>PLAN NUTRICIONAL</span>
          </div>

          <h1 className="display-5 fw-bold text-white mb-2">
            Alimentación <span style={{ color: 'var(--color-primary, #9EF01A)' }}>Deportiva</span>
          </h1>

          <p className="lead text-secondary mb-4" style={{ maxWidth: '620px' }}>
            Planificá tus comidas, registrá tu nutrición y mantené la energía
            necesaria para potenciar cada entrenamiento.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <Button
              onClick={() => setShowPlanSemanal(true)}
              className="forza-btn-primary d-inline-flex align-items-center gap-2 py-2 px-4"
            >
              <span aria-hidden="true">📅</span>
              <span>Ver plan semanal</span>
            </Button>
            <span className="text-secondary small d-none d-md-inline">
              • Fotografías reales de lunes a domingo
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          B. FILA DE 4 TARJETAS DE ESTADÍSTICAS CON FOTOGRAFÍAS REALES
          ==================================================================== */}
      <section className="mb-4 mb-md-5" aria-label="Estadísticas nutricionales">
        <Row className="g-3 g-md-4">
          {estadisticasNutricionales.map((stat) => (
            <Col key={stat.id} xs={12} sm={6} lg={3}>
              <NutritionStatCard
                nombre={stat.nombre}
                consumido={
                  stat.id === 1
                    ? caloriasConsumidas
                    : stat.id === 4
                    ? Number(hidratacion.toFixed(2))
                    : stat.consumido
                }
                objetivo={stat.id === 1 ? META_CALORICA : stat.objetivo}
                unidad={stat.unidad}
                imagen={stat.imagen}
                alt={stat.alt}
              />
            </Col>
          ))}
        </Row>
      </section>

      {/* ====================================================================
          C. CONTENIDO PRINCIPAL (Plan de Comidas + Sidebar Calórico)
          ==================================================================== */}
      <Row className="g-4 align-items-start">
        {/* C.1 COLUMNA IZQUIERDA: COMIDAS DE HOY E HIDRATACIÓN */}
        <Col xs={12} lg={8}>
          <Card className="forza-card border-0 rounded-4 shadow-sm mb-4">
            <Card.Body className="p-3 p-md-4">
              {/* Encabezado de la sección */}
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="h4 fw-bold text-white mb-1">🍽️ Plan de comidas de hoy</h2>
                  <p className="text-secondary small mb-0">
                    Organizá tu alimentación y registrá las comidas que completaste.
                  </p>
                </div>
                <Badge
                  className="rounded-pill px-3 py-2 fw-bold"
                  style={{
                    backgroundColor: 'rgba(158, 240, 26, 0.15)',
                    color: 'var(--color-primary, #9EF01A)',
                    border: '1px solid rgba(158, 240, 26, 0.35)',
                    fontSize: '0.82rem',
                  }}
                >
                  {comidasConsumidasIds.length} de {comidasDelDia.length} comidas completadas
                </Badge>
              </div>

              {/* Lista interactiva de comidas */}
              <div className="d-flex flex-column mb-4">
                {comidasDelDia.map((comida) => (
                  <MealItemCard
                    key={comida.id}
                    comida={comida}
                    consumida={comidasConsumidasIds.includes(comida.id)}
                    onClick={() => setModalComida(comida)}
                  />
                ))}
              </div>

              {/* SECCIÓN DE CONTROL DE HIDRATACIÓN */}
              <div
                className="p-3 p-md-4 rounded-4"
                style={{
                  backgroundColor: 'var(--bg-sidebar, #0D1114)',
                  border: '1px solid var(--border-color, #2A3035)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fs-5" aria-hidden="true">💧</span>
                      <h3 className="h6 fw-bold text-white mb-0">Control de Hidratación</h3>
                    </div>
                    <span className="text-secondary small">
                      {hidratacion.toFixed(2)} L de 2.50 L recomendados ({Math.min(100, Math.round((hidratacion / 2.5) * 100))}%)
                    </span>
                  </div>

                  {/* Botones de acción rápida */}
                  <div className="d-flex align-items-center gap-3">
                    <button
                      type="button"
                      className="hidratacion-btn"
                      onClick={quitarAgua}
                      aria-label="Restar 250 ml de agua"
                      title="Restar 250 ml"
                    >
                      −
                    </button>

                    <span className="fw-bold fs-5 text-white" style={{ minWidth: '70px', textAlign: 'center' }}>
                      {hidratacion.toFixed(2)} L
                    </span>

                    <button
                      type="button"
                      className="hidratacion-btn"
                      onClick={agregarAgua}
                      aria-label="Sumar 250 ml de agua"
                      title="Sumar 250 ml"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 10 segmentos visuales de agua (250 ml c/u) */}
                <div className="d-flex align-items-center gap-1 w-100 py-1" aria-hidden="true">
                  {Array.from({ length: vasosAguaTotal }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex-grow-1 hidratacion-bar-segment ${
                        index < vasosLlenos
                          ? 'hidratacion-bar-segment--active'
                          : 'hidratacion-bar-segment--inactive'
                      }`}
                      title={`Vaso ${index + 1}: 250 ml`}
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-between text-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                  <span>0.00 L</span>
                  <span>1.25 L</span>
                  <span>2.50 L (Meta óptima)</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* C.2 COLUMNA DERECHA: BALANCE CALÓRICO Y TIPS NUTRICIONALES */}
        <Col xs={12} lg={4}>
          <div className="d-flex flex-column gap-3">
            <CalorieGoalCard consumidas={caloriasConsumidas} meta={META_CALORICA} />
            <NutritionTipsCard tips={tipsNutricionales} />
          </div>
        </Col>
      </Row>

      {/* ====================================================================
          MODAL 1: FICHA NUTRICIONAL PREMIUM (DETALLE DE COMIDA)
          ==================================================================== */}
      <Modal
        show={modalComida !== null}
        onHide={() => setModalComida(null)}
        centered
        size="md"
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {modalComida && (
          <>
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-0 pb-0"
            >
              <div>
                <Badge
                  className="rounded-pill mb-2 px-3 py-1"
                  style={{
                    backgroundColor: 'rgba(158, 240, 26, 0.15)',
                    color: 'var(--color-primary, #9EF01A)',
                    border: '1px solid rgba(158, 240, 26, 0.35)',
                    fontSize: '0.75rem',
                  }}
                >
                  Horario sugerido: {modalComida.hora}
                </Badge>
                <Modal.Title className="text-white fw-bold fs-4">
                  {modalComida.nombre}
                </Modal.Title>
              </div>
            </Modal.Header>

            <Modal.Body>
              {/* Fotografía gastronómica de alta definición */}
              <div className="rounded-3 overflow-hidden mb-3 border border-secondary">
                <img
                  src={modalComida.imagen}
                  alt={modalComida.alt || modalComida.nombre}
                  className="w-100 object-fit-cover d-block"
                  style={{ height: '220px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <p className="text-secondary small mb-3">
                {modalComida.descripcion}
              </p>

              {/* Estado actual de consumo */}
              <div className="d-flex align-items-center justify-content-between mb-3 p-2 px-3 rounded-3" style={{ backgroundColor: 'var(--bg-sidebar, #0D1114)', border: '1px solid var(--border-color, #2A3035)' }}>
                <span className="text-secondary small">Estado del registro:</span>
                {comidasConsumidasIds.includes(modalComida.id) ? (
                  <Badge
                    className="px-3 py-2 fw-bold"
                    style={{ backgroundColor: 'var(--color-primary, #9EF01A)', color: '#080B0D' }}
                  >
                    ✓ Marcada como consumida
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="px-3 py-2">
                    Estado: Pendiente
                  </Badge>
                )}
              </div>

              {/* Ficha de macronutrientes: 4 mini tarjetas oscuras */}
              <h4 className="h6 text-white fw-bold mb-2">Composición Nutricional</h4>
              <Row className="g-2 mb-2">
                <Col xs={6} sm={3}>
                  <div className="macro-pill-card">
                    <div className="macro-pill-val" style={{ color: 'var(--color-primary, #9EF01A)' }}>
                      {modalComida.calorias}
                    </div>
                    <div className="macro-pill-label">Calorías (kcal)</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="macro-pill-card">
                    <div className="macro-pill-val">{modalComida.macros?.proteinas ?? 0}g</div>
                    <div className="macro-pill-label">Proteínas</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="macro-pill-card">
                    <div className="macro-pill-val">{modalComida.macros?.carbos ?? 0}g</div>
                    <div className="macro-pill-label">Carbohidratos</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="macro-pill-card">
                    <div className="macro-pill-val">{modalComida.macros?.grasas ?? 0}g</div>
                    <div className="macro-pill-label">Grasas</div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
              <Button
                onClick={() => {
                  toggleComidaConsumida(modalComida.id);
                  setModalComida(null);
                }}
                className={
                  comidasConsumidasIds.includes(modalComida.id)
                    ? 'forza-btn-secondary w-100 py-2'
                    : 'forza-btn-primary w-100 py-2'
                }
              >
                {comidasConsumidasIds.includes(modalComida.id)
                  ? '✗ Marcar como pendiente'
                  : '✓ Marcar como consumida'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* ====================================================================
          MODAL 2: PLAN SEMANAL CON FOTOGRAFÍAS GASTRONÓMICAS Y SELECTOR DE DÍAS
          ==================================================================== */}
      <Modal
        show={showPlanSemanal}
        onHide={() => setShowPlanSemanal(false)}
        centered
        size="lg"
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-0 pb-2"
        >
          <div>
            <Modal.Title className="text-white fw-bold fs-4">
              📅 Plan semanal de alimentación
            </Modal.Title>
            <p className="text-secondary small mb-0">
              Organizá tus comidas de lunes a domingo con fotografías reales.
            </p>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-0">
          {/* Barra selectora de días */}
          <div className="d-flex flex-wrap gap-2 py-3 border-bottom border-secondary border-opacity-50 mb-4">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia.clave}
                type="button"
                className={`plan-semanal-day-btn ${
                  diaSemanalSeleccionado === dia.clave ? 'active' : ''
                }`}
                onClick={() => setDiaSemanalSeleccionado(dia.clave)}
              >
                <span className="d-none d-sm-inline">{dia.clave}</span>
                <span className="d-sm-none">{dia.etiquetaCorta}</span>
              </button>
            ))}
          </div>

          {/* Título dinámico del día seleccionado */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="h5 fw-bold text-white mb-0">
              Comidas del <span style={{ color: 'var(--color-primary, #9EF01A)' }}>{diaSemanalSeleccionado}</span>
            </h3>
            <span className="text-secondary small">4 comidas planificadas</span>
          </div>

          {/* Grilla de 4 tarjetas con fotografía real a la izquierda */}
          <Row className="g-3">
            {comidasDelDiaSeleccionado.map((comida) => (
              <Col key={comida.id} xs={12} md={6}>
                <div className="semanal-meal-card h-100 d-flex align-items-center gap-3">
                  {/* Fotografía de la comida a la izquierda */}
                  <img
                    src={comida.imagen}
                    alt={comida.alt || comida.descripcion}
                    className="semanal-meal-thumb flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />

                  {/* Datos de la comida a la derecha */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between mb-1 gap-2">
                      <span className="fw-bold text-white fs-6">{comida.nombre}</span>
                      <Badge className="bg-dark border border-secondary text-secondary small py-1 px-2 flex-shrink-0">
                        🕐 {comida.hora}
                      </Badge>
                    </div>

                    <p className="text-light small mb-2" style={{ lineHeight: '1.35', fontSize: '0.85rem' }}>
                      {comida.descripcion}
                    </p>

                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: 'rgba(158, 240, 26, 0.12)',
                        color: 'var(--color-primary, #9EF01A)',
                        fontSize: '0.72rem',
                      }}
                    >
                      {comida.tipo}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="secondary"
            onClick={() => setShowPlanSemanal(false)}
            className="px-4 py-2 rounded-3"
          >
            Cerrar plan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AlimentacionPage;
