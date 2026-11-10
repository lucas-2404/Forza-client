import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DumbbellIcon, CalendarIcon, ChartIcon, HeartIcon, AppleIcon } from '../components/layout/Icons';

/**
 * PÁGINA DE INICIO (HomePage) — FORZA
 *
 * Arquitectura: 90 % Bootstrap / 10 % CSS Personalizado.
 * - Todo el responsive se resuelve con el sistema de grillas (Container, Row, Col)
 *   y utilidades de flexbox / espaciado nativas de Bootstrap 5.
 * - Sin media queries de pantalla en CSS.
 * - Navegación fluida y componentes desacoplados fáciles de explicar académicamente.
 */
function HomePage() {
  // Arreglo de accesos rápidos a las secciones principales de FORZA
  const accesosRapidos = [
    {
      id: 1,
      titulo: 'Ejercicios',
      descripcion: 'Catálogo técnico clasificado por grupo muscular.',
      ruta: '/ejercicios',
      icono: DumbbellIcon,
      badge: '+50 movs',
    },
    {
      id: 2,
      titulo: 'Mis rutinas',
      descripcion: 'Organizá series, repeticiones y días de entreno.',
      ruta: '/rutinas',
      icono: CalendarIcon,
      badge: 'Programación',
    },
    {
      id: 3,
      titulo: 'Mi progreso',
      descripcion: 'Métricas de constancia y sesiones completadas.',
      ruta: '/dashboard',
      icono: ChartIcon,
      badge: 'Estadísticas',
    },
    {
      id: 4,
      titulo: 'Favoritos',
      descripcion: 'Tu selección rápida de ejercicios guardados.',
      ruta: '/favoritos',
      icono: HeartIcon,
      badge: 'Colección',
    },
  ];

  // Arreglo de ejercicios destacados para la portada
  const ejerciciosDestacados = [
    {
      id: 1,
      nombre: 'Press de banca',
      grupoMuscular: 'Pecho',
      nivel: 'Intermedio',
      seriesSugeridas: '4 series × 8-10 reps',
      imagen: '/img/press-banca.webp',
      alt: 'Atleta ejecutando press de banca en banco plano con barra',
    },
    {
      id: 2,
      nombre: 'Sentadilla',
      grupoMuscular: 'Piernas',
      nivel: 'Avanzado',
      seriesSugeridas: '4 series × 6-8 reps',
      imagen: '/img/sentadilla.webp',
      alt: 'Persona realizando sentadilla trasera con barra olímpica',
    },
    {
      id: 3,
      nombre: 'Dominadas',
      grupoMuscular: 'Espalda',
      nivel: 'Intermedio',
      seriesSugeridas: '3 series × al fallo',
      imagen: '/img/dominadas.webp',
      alt: 'Entrenamiento de dominadas en barra para dorsales y espalda',
    },
    {
      id: 4,
      nombre: 'Curl de bíceps',
      grupoMuscular: 'Bíceps',
      nivel: 'Principiante',
      seriesSugeridas: '3 series × 12 reps',
      imagen: '/img/curl-biceps.webp',
      alt: 'Ejercicio de curl de bíceps con mancuernas de pie',
    },
  ];

  // Lista de ejercicios de la rutina sugerida del día
  const ejerciciosRutinaHoy = [
    { id: 1, nombre: 'Sentadillas con barra', series: '4 series × 8-10 reps', grupo: 'Piernas' },
    { id: 2, nombre: 'Press de banca plano', series: '4 series × 8 reps', grupo: 'Pecho' },
    { id: 3, nombre: 'Dominadas pronadas', series: '3 series × al fallo', grupo: 'Espalda' },
    { id: 4, nombre: 'Curl de bíceps martillo', series: '3 series × 12 reps', grupo: 'Bíceps' },
  ];

  return (
    <Container fluid className="px-0">
      {/* ====================================================================
          A. HERO PRINCIPAL (Estética Deportiva de Alto Impacto)
          ==================================================================== */}
      <section
        className="home-hero p-4 p-md-5 mb-4 mb-md-5 rounded-4 border border-secondary shadow-lg d-flex flex-column justify-content-between"
        aria-label="Sección de bienvenida"
      >
        <div className="py-2 py-md-3">
          {/* Badge superior de identidad */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill forza-badge mb-3">
            <span aria-hidden="true">⚡</span>
            <span>Plataforma de Entrenamiento FORZA</span>
          </div>

          <h1 className="display-5 fw-bold text-white mb-3">
            Tu progreso <span className="text-lime-glow">comienza aquí</span>
          </h1>

          <p className="lead text-secondary mb-4 col-12 col-xl-8 ps-0">
            Explorá ejercicios técnicos, diseñá y gestioná tus rutinas de entrenamiento,
            y alcanzá tu máximo rendimiento físico con una plataforma moderna e intuitiva.
          </p>

          {/* Botones de llamada a la acción */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Button
              as={Link}
              to="/ejercicios"
              className="forza-btn-primary d-inline-flex align-items-center gap-2"
            >
              <DumbbellIcon size={18} />
              <span>Explorar ejercicios</span>
              <span aria-hidden="true">→</span>
            </Button>

            <Button
              as={Link}
              to="/rutinas"
              className="forza-btn-secondary d-inline-flex align-items-center gap-2"
            >
              <CalendarIcon size={18} />
              <span>Ver mis rutinas</span>
            </Button>

            <Button
              as={Link}
              to="/alimentacion"
              className="forza-btn-outline d-inline-flex align-items-center gap-2"
            >
              <AppleIcon size={18} />
              <span>Plan de alimentación</span>
            </Button>
          </div>
        </div>

        {/* Franja de métricas clave integradas */}
        <div className="pt-3 border-top border-secondary border-opacity-50">
          <Row className="g-3">
            <Col xs={6} md={3}>
              <div className="text-white fw-bold fs-5 mb-0">+50</div>
              <div className="text-secondary small">Movimientos técnicos</div>
            </Col>
            <Col xs={6} md={3}>
              <div className="text-white fw-bold fs-5 mb-0">100%</div>
              <div className="text-secondary small">Rutinas personalizables</div>
            </Col>
            <Col xs={6} md={3}>
              <div className="text-white fw-bold fs-5 mb-0">2,200 kcal</div>
              <div className="text-secondary small">Meta nutricional diaria</div>
            </Col>
            <Col xs={6} md={3}>
              <div className="text-white fw-bold fs-5 mb-0">Semanal</div>
              <div className="text-secondary small">Planificación guiada</div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ====================================================================
          B. ACCESOS DIRECTOS (Grilla Bootstrap col-12 col-sm-6 col-lg-3)
          ==================================================================== */}
      <section className="mb-4 mb-md-5" aria-label="Accesos directos">
        <div className="mb-3">
          <h2 className="h4 fw-bold text-white mb-1">Accesos directos</h2>
          <p className="text-secondary small mb-0">
            Navegá rápidamente a las herramientas principales de tu entrenamiento.
          </p>
        </div>

        <Row className="g-3 g-md-4">
          {accesosRapidos.map((acceso) => {
            const Icono = acceso.icono;
            return (
              <Col xs={12} sm={6} lg={3} key={acceso.id}>
                <Card
                  as={Link}
                  to={acceso.ruta}
                  className="quick-access-card p-3 p-md-4 h-100 rounded-3 text-white text-decoration-none shadow-sm d-flex flex-column justify-content-between"
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="quick-access-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Icono size={22} />
                      </div>
                      <Badge className="forza-badge-muted" style={{ fontSize: '0.7rem' }}>
                        {acceso.badge}
                      </Badge>
                    </div>

                    <h3 className="h6 fw-bold text-white mb-2">{acceso.titulo}</h3>
                    <p className="text-secondary small mb-0">{acceso.descripcion}</p>
                  </div>

                  <div className="pt-3 mt-3 border-top border-secondary border-opacity-50 d-flex align-items-center justify-content-between text-secondary small">
                    <span style={{ color: 'var(--color-primary)' }}>Acceder al módulo</span>
                    <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>→</span>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      {/* ====================================================================
          C. EJERCICIOS DESTACADOS (Tarjetas con imagen, tags e interacciones)
          ==================================================================== */}
      <section className="mb-4 mb-md-5" aria-label="Ejercicios destacados">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="h4 fw-bold text-white mb-1">Ejercicios destacados</h2>
            <p className="text-secondary small mb-0">
              Movimientos multiarticulares recomendados para ganar fuerza, potencia y masa muscular.
            </p>
          </div>
          <Button as={Link} to="/ejercicios" className="forza-btn-outline btn-sm">
            Ver catálogo completo →
          </Button>
        </div>

        <Row className="g-3 g-md-4">
          {ejerciciosDestacados.map((ejercicio) => (
            <Col xs={12} sm={6} lg={3} key={ejercicio.id}>
              <Card className="exercise-card h-100 rounded-3 text-white overflow-hidden shadow-sm d-flex flex-column justify-content-between">
                <div>
                  {/* Contenedor de imagen con degradado de integración */}
                  <div className="exercise-card-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={ejercicio.imagen}
                      alt={ejercicio.alt}
                      className="exercise-card-img w-100 h-100 object-fit-cover"
                      loading="lazy"
                    />
                    <div className="exercise-card-gradient" />
                    {/* Badge flotante de grupo muscular */}
                    <div className="position-absolute top-0 start-0 m-3 z-1">
                      <Badge className="forza-badge">{ejercicio.grupoMuscular}</Badge>
                    </div>
                  </div>

                  <Card.Body className="p-3">
                    <Card.Title className="h6 fw-bold text-white mb-1">
                      {ejercicio.nombre}
                    </Card.Title>
                    <div className="d-flex align-items-center justify-content-between text-secondary small mb-2">
                      <span>Nivel: {ejercicio.nivel}</span>
                      <span className="text-light">{ejercicio.seriesSugeridas}</span>
                    </div>
                  </Card.Body>
                </div>

                <div className="p-3 pt-0">
                  <Button
                    as={Link}
                    to="/ejercicios"
                    className="forza-btn-outline btn-sm w-100"
                  >
                    Ver detalles técnicos
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* ====================================================================
          D. TU RUTINA DE HOY Y E. MOTIVACIÓN DIARIA (Layout 2 Columnas)
          ==================================================================== */}
      <section className="mb-3" aria-label="Rutina sugerida y motivación">
        <Row className="g-4 align-items-stretch">
          {/* D. SECCIÓN: TU RUTINA DE HOY */}
          <Col xs={12} lg={6}>
            <Card
              className="h-100 p-4 rounded-4 border-secondary text-white d-flex flex-column justify-content-between shadow-sm"
              style={{ backgroundColor: 'var(--bg-card, #171C20)' }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5" aria-hidden="true">📋</span>
                    <h2 className="h4 fw-bold text-white mb-0">Tu rutina de hoy</h2>
                  </div>
                  <Badge className="forza-badge">Rutina sugerida</Badge>
                </div>

                <div className="mb-3 p-3 rounded-3" style={{ backgroundColor: 'var(--bg-sidebar, #0D1114)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h3 className="h6 fw-bold mb-0" style={{ color: 'var(--color-primary, #9EF01A)' }}>
                      Entrenamiento de Cuerpo Completo
                    </h3>
                    <span className="badge bg-dark border border-secondary text-secondary small">
                      45-60 min
                    </span>
                  </div>
                  <p className="text-secondary small mb-0">
                    Activación neuromuscular integral para fuerza y resistencia general.
                  </p>
                </div>

                {/* Lista numerada de ejercicios */}
                <div className="d-flex flex-column gap-2 mb-4">
                  {ejerciciosRutinaHoy.map((item, index) => (
                    <div
                      key={item.id}
                      className="routine-exercise-item d-flex align-items-center justify-content-between p-2 px-3 rounded-2"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="routine-number-pill rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <span className="fw-semibold text-white d-block small">{item.nombre}</span>
                          <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.grupo}</span>
                        </div>
                      </div>
                      <Badge className="forza-badge-muted" style={{ fontSize: '0.75rem' }}>
                        {item.series}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button as={Link} to="/rutinas" className="forza-btn-primary w-100 py-2">
                  Iniciar sesión de entrenamiento
                </Button>
              </div>
            </Card>
          </Col>

          {/* E. SECCIÓN MOTIVACIONAL Y COMUNIDAD */}
          <Col xs={12} lg={6}>
            <Card
              className="h-100 p-4 rounded-4 border-secondary text-white d-flex flex-column justify-content-between shadow-sm"
              style={{ backgroundColor: 'var(--bg-card, #171C20)' }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5" aria-hidden="true">🔥</span>
                    <h2 className="h4 fw-bold text-white mb-0">Mentalidad FORZA</h2>
                  </div>
                  <Badge className="forza-badge-muted">Comunidad</Badge>
                </div>

                <p className="text-secondary small mb-3">
                  La constancia, el descanso adecuado y la disciplina diaria construyen los resultados duraderos.
                </p>

                {/* Imagen Motivacional con efecto zoom controlado */}
                <div className="motivation-img-wrapper mb-3">
                  <img
                    src="/img/motivacion.webp"
                    alt="Atleta en el gimnasio superando sus límites - Mentalidad FORZA"
                    className="w-100 object-fit-cover d-block"
                    loading="lazy"
                  />
                </div>

                {/* Racha y constancia activa */}
                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between mb-3"
                  style={{ backgroundColor: 'var(--bg-sidebar, #0D1114)', border: '1px solid var(--border-color)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4" aria-hidden="true">🏆</span>
                    <div>
                      <div className="fw-semibold text-white small">Racha activa de entreno</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>5 días consecutivos registrados</div>
                    </div>
                  </div>
                  <span
                    className="badge rounded-pill px-3 py-1 fw-bold"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#080B0D' }}
                  >
                    Nivel Oro
                  </span>
                </div>
              </div>

              <div className="border-top border-secondary pt-3 mt-auto">
                <blockquote className="mb-0 text-center">
                  <p className="fst-italic text-light small mb-1">
                    "La disciplina es el puente entre tus metas y tus logros."
                  </p>
                  <footer className="text-secondary small">— Filosofía de Entrenamiento FORZA</footer>
                </blockquote>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default HomePage;
