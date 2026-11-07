import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RutinaCard from '../components/rutinas/RutinaCard';
import {
  obtenerRutinas,
  eliminarRutina,
  calcularEstadisticas,
  registrarEntrenamiento,
} from '../services/rutinasService';

/**
 * Página principal de Rutinas — Pantalla 1 del Diseño A.
 * Utiliza 90% componentes y utilidades nativas de Bootstrap 5.
 */
function RutinaPage() {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalRutinas: 0,
    entrenamientosSemanales: 0,
    duracionPromedio: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const rutinasCargadas = obtenerRutinas();
    const stats = calcularEstadisticas();
    setRutinas(rutinasCargadas);
    setEstadisticas(stats);
  };

  const handleEliminar = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: 'Se quitará de tu lista de entrenamientos.',
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
        text: 'La rutina fue eliminada.',
        icon: 'success',
        background: '#171C20',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleAbrir = (rutina) => {
    navigate(`/rutinas/editar/${rutina.id}`);
  };

  const handleCompletar = async (rutina) => {
    const { value: duracion } = await Swal.fire({
      title: `¡Entrenamiento completado!`,
      html: `
        <p class="text-secondary small mb-2">Rutina: <strong class="text-light">${rutina.nombre}</strong></p>
        <label class="text-secondary small d-block mb-1">Duración en minutos:</label>
        <input id="swal-duracion" type="number" min="1" max="300" value="45"
          class="form-control bg-dark text-light border-secondary text-center mx-auto" style="max-width: 130px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
      preConfirm: () => {
        const val = parseInt(document.getElementById('swal-duracion').value, 10);
        if (!val || val <= 0) {
          Swal.showValidationMessage('Ingresá una duración válida.');
          return false;
        }
        return val;
      },
    });

    if (duracion) {
      const res = registrarEntrenamiento(rutina.id, rutina.nombre, duracion);
      if (res === null) {
        Swal.fire({
          title: 'Sesión ya registrada',
          text: 'Ya anotaste un entrenamiento de esta rutina hoy.',
          icon: 'info',
          background: '#171C20',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });
      } else {
        Swal.fire({
          title: '¡Sesión registrada!',
          text: `Sumaste ${duracion} minutos a tu historial de progreso.`,
          icon: 'success',
          background: '#171C20',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
          timer: 2000,
          showConfirmButton: false,
        });
        cargarDatos();
      }
    }
  };

  return (
    <Container className="py-2">
      {/* ─── BANNER DEPORTIVO (Construido con utilidades Bootstrap) ─── */}
      <div 
        className="p-4 p-md-5 mb-4 rounded-4 position-relative overflow-hidden border border-secondary"
        style={{ background: 'linear-gradient(135deg, #080B0D 0%, #0D1114 65%, #152206 100%)' }}
      >
        <Row className="align-items-center">
          <Col md={8}>
            <Badge className="forza-badge mb-2">⚡ Mis Rutinas</Badge>
            <h1 className="display-6 fw-bold text-light mb-2">
              Mis <span style={{ color: 'var(--color-primary)' }}>Rutinas</span>
            </h1>
            <p className="text-secondary mb-3 col-lg-10">
              Organizá tus entrenamientos, creá rutinas semanales y alcanzá tus objetivos.
            </p>
            <Button
              className="forza-btn-primary btn-sm"
              onClick={() => navigate('/rutinas/nueva')}
            >
              + Crear rutina
            </Button>
          </Col>
          <Col md={4} className="d-none d-md-flex justify-content-end">
            <div 
              className="rounded-4 border border-secondary d-flex align-items-center justify-content-center p-4 bg-black"
              style={{ width: '130px', height: '130px', boxShadow: '0 0 30px rgba(158, 240, 26, 0.15)' }}
            >
              <span className="display-4">🏃‍♂️</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* ─── TARJETAS DE ESTADÍSTICAS (Bootstrap Row + Col + Card) ─── */}
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
                <div className="h4 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {estadisticas.totalRutinas}
                </div>
                <small className="text-secondary fw-semibold">Rutinas activas</small>
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
                ⚡
              </div>
              <div>
                <div className="h4 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {estadisticas.entrenamientosSemanales}
                </div>
                <small className="text-secondary fw-semibold">Entrenamientos/sem</small>
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
                <div className="h4 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {estadisticas.duracionPromedio} min
                </div>
                <small className="text-secondary fw-semibold">Duración promedio</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── SECCIÓN MIS RUTINAS ─── */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 fw-bold text-light mb-0">Mis rutinas</h2>
        <Button
          className="forza-btn-primary btn-sm"
          onClick={() => navigate('/rutinas/nueva')}
        >
          + Crear rutina
        </Button>
      </div>

      {rutinas.length === 0 ? (
        <Card className="forza-card text-center py-5 border-secondary">
          <Card.Body>
            <span className="display-4 d-block mb-3">🏋️‍♂️</span>
            <h5 className="text-light mb-2">No tenés rutinas creadas</h5>
            <p className="text-secondary small mb-3">Creá tu primer plan semanal para empezar a entrenar.</p>
            <Button className="forza-btn-primary btn-sm" onClick={() => navigate('/rutinas/nueva')}>
              + Crear mi primera rutina
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {rutinas.map((rutina) => (
            <Col xs={12} sm={6} lg={4} key={rutina.id}>
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
    </Container>
  );
}

export default RutinaPage;
