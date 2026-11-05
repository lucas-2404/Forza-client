import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DumbbellIcon, CalendarIcon, ChartIcon, HeartIcon } from '../components/layout/Icons';
import './HomePage.css';

/**
 * PÁGINA DE INICIO (HomePage) — DISEÑO 1 DE FORZA
 *
 * Estructura de la página:
 * 1. Hero Principal: Título destacado, descripción, botones de acción e imagen de fondo.
 * 2. Accesos Rápidos: 4 tarjetas interactivas que enlazan a las secciones principales.
 * 3. Ejercicios Destacados: 4 tarjetas con imágenes deportivas reales y grupo muscular.
 * 4. Tu Rutina de Hoy: Tarjeta de rutina sugerida de cuerpo completo.
 * 5. Sección Motivacional: Imagen inspiradora de alta calidad y frase de disciplina.
 *
 * Tecnologías: React, React Bootstrap (80%), CSS Personalizado (20%) y React Router.
 */
function HomePage() {
  // Arreglo con los 4 accesos rápidos principales de la aplicación
  const accesosRapidos = [
    {
      id: 1,
      titulo: 'Ejercicios',
      descripcion: 'Explorá nuestro catálogo de ejercicios.',
      ruta: '/ejercicios',
      icono: DumbbellIcon,
    },
    {
      id: 2,
      titulo: 'Mis rutinas',
      descripcion: 'Organizá tus entrenamientos.',
      ruta: '/rutinas',
      icono: CalendarIcon,
    },
    {
      id: 3,
      titulo: 'Mi progreso',
      descripcion: 'Consultá tu actividad.',
      ruta: '/dashboard',
      icono: ChartIcon,
    },
    {
      id: 4,
      titulo: 'Favoritos',
      descripcion: 'Accedé a tus ejercicios guardados.',
      ruta: '/favoritos',
      icono: HeartIcon,
    },
  ];

  // Arreglo con los 4 ejercicios destacados (imágenes locales en public/img)
  const ejerciciosDestacados = [
    {
      id: 1,
      nombre: 'Press de banca',
      grupoMuscular: 'Pecho',
      imagen: '/img/press-banca.webp',
      alt: 'Atleta ejecutando press de banca en banco plano con barra',
    },
    {
      id: 2,
      nombre: 'Sentadilla',
      grupoMuscular: 'Piernas',
      imagen: '/img/sentadilla.webp',
      alt: 'Persona realizando sentadilla trasera con barra olímpica',
    },
    {
      id: 3,
      nombre: 'Dominadas',
      grupoMuscular: 'Espalda',
      imagen: '/img/dominadas.webp',
      alt: 'Entrenamiento de dominadas en barra para dorsales y espalda',
    },
    {
      id: 4,
      nombre: 'Curl de bíceps',
      grupoMuscular: 'Bíceps',
      imagen: '/img/curl-biceps.webp',
      alt: 'Ejercicio de curl de bíceps con mancuernas de pie',
    },
  ];

  // Lista de ejercicios para la rutina sugerida de hoy
  const ejerciciosRutinaHoy = [
    { id: 1, nombre: 'Sentadillas', series: '4 series × 8-10 reps', grupo: 'Piernas' },
    { id: 2, nombre: 'Press de banca', series: '4 series × 8 reps', grupo: 'Pecho' },
    { id: 3, nombre: 'Dominadas', series: '3 series × al fallo', grupo: 'Espalda' },
    { id: 4, nombre: 'Curl de bíceps', series: '3 series × 12 reps', grupo: 'Bíceps' },
  ];

  return (
    <Container fluid className="px-0">
      {/* ====================================================================
          A. HERO PRINCIPAL
          ==================================================================== */}
      <section className="home-hero p-4 p-md-5 mb-5" aria-label="Sección de bienvenida">
        <div className="py-2 py-md-3">
          <Badge className="forza-badge mb-3">Tu centro de entrenamiento</Badge>
          <h1 className="home-hero-title mb-3">
            Tu progreso <span>comienza aquí</span>
          </h1>
          <p className="home-hero-desc mb-4">
            Explorá ejercicios, organizá tus rutinas y llevá tus entrenamientos al siguiente nivel con FORZA.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Button as={Link} to="/ejercicios" className="forza-btn-primary">
              Explorar ejercicios
            </Button>
            <Button as={Link} to="/rutinas" className="forza-btn-secondary">
              Ver mis rutinas
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          B. ACCESOS RÁPIDOS (4 Tarjetas mapeadas dinámicamente)
          ==================================================================== */}
      <section className="mb-5" aria-label="Accesos rápidos">
        <Row className="g-3 g-md-4">
          {accesosRapidos.map((acceso) => {
            const Icono = acceso.icono;
            return (
              <Col xs={12} sm={6} lg={3} key={acceso.id}>
                <Link to={acceso.ruta} className="quick-access-card p-3 p-md-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="quick-access-icon-box" aria-hidden="true">
                      <Icono size={22} />
                    </div>
                    <h2 className="h6 fw-bold text-white mb-0">{acceso.titulo}</h2>
                  </div>
                  <p className="text-secondary small mb-0">{acceso.descripcion}</p>
                </Link>
              </Col>
            );
          })}
        </Row>
      </section>

      {/* ====================================================================
          C. EJERCICIOS DESTACADOS (4 Tarjetas con imágenes locales)
          ==================================================================== */}
      <section className="mb-5" aria-label="Ejercicios destacados">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="h4 fw-bold text-white mb-1">Ejercicios destacados</h2>
            <p className="text-secondary small mb-0">
              Movimientos fundamentales recomendados para ganar fuerza y masa muscular.
            </p>
          </div>
          <Button as={Link} to="/ejercicios" className="forza-btn-outline btn-sm">
            Ver catálogo completo →
          </Button>
        </div>

        <Row className="g-4">
          {ejerciciosDestacados.map((ejercicio) => (
            <Col xs={12} sm={6} lg={3} key={ejercicio.id}>
              <Card className="exercise-card">
                <div className="exercise-img-container">
                  <img
                    src={ejercicio.imagen}
                    alt={ejercicio.alt}
                    className="exercise-card-img"
                    loading="lazy"
                  />
                </div>
                <Card.Body className="p-3 d-flex flex-column justify-content-between">
                  <div>
                    <Badge className="forza-badge-muted mb-2">{ejercicio.grupoMuscular}</Badge>
                    <Card.Title className="h6 fw-bold text-white mb-3">
                      {ejercicio.nombre}
                    </Card.Title>
                  </div>
                  <Button as={Link} to="/ejercicios" className="forza-btn-outline btn-sm w-100">
                    Explorar ejercicios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* ====================================================================
          D. TU RUTINA DE HOY Y E. SECCIÓN MOTIVACIONAL (Distribución equilibrada)
          ==================================================================== */}
      <section className="mb-4" aria-label="Rutina sugerida y motivación">
        <Row className="g-4 align-items-stretch">
          {/* D. SECCIÓN: TU RUTINA DE HOY */}
          <Col xs={12} lg={6}>
            <Card className="routine-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 fw-bold text-white mb-0">Tu rutina de hoy</h2>
                  <Badge className="forza-badge">Rutina sugerida</Badge>
                </div>

                <div className="mb-4">
                  <h3 className="h5 fw-bold" style={{ color: 'var(--color-primary, #9EF01A)' }}>
                    Entrenamiento de cuerpo completo
                  </h3>
                  <p className="text-secondary small mb-0">
                    Sesión integral diseñada para activar los principales grupos musculares.
                  </p>
                </div>

                {/* Lista de ejercicios sugeridos */}
                <div className="d-flex flex-column gap-2 mb-4">
                  {ejerciciosRutinaHoy.map((item) => (
                    <div key={item.id} className="routine-exercise-item">
                      <div className="d-flex align-items-center">
                        <span className="routine-bullet" aria-hidden="true" />
                        <span className="fw-semibold text-white">{item.nombre}</span>
                      </div>
                      <span className="small text-secondary">{item.series}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button as={Link} to="/rutinas" className="forza-btn-primary w-100">
                  Ver mis rutinas
                </Button>
              </div>
            </Card>
          </Col>

          {/* E. SECCIÓN MOTIVACIONAL */}
          <Col xs={12} lg={6}>
            <Card className="motivation-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 fw-bold text-white mb-0">Motivación diaria</h2>
                  <Badge className="forza-badge-muted">Mentalidad FORZA</Badge>
                </div>

                <p className="text-secondary small mb-3">
                  La constancia y el esfuerzo diario construyen los resultados que buscas.
                </p>

                {/* Imagen Motivacional local (public/img/motivacion.webp) */}
                <div className="motivation-img-box mb-3">
                  <img
                    src="/img/motivacion.webp"
                    alt="Atleta en el gimnasio superando sus límites - Mentalidad FORZA"
                    className="motivation-img"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="border-top border-secondary pt-3 mt-auto">
                <blockquote className="mb-0 text-center">
                  <p className="fst-italic text-light small mb-1">
                    "La disciplina es el puente entre tus metas y tus logros."
                  </p>
                  <footer className="text-secondary small">— Comunidad FORZA</footer>
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
