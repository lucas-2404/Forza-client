import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  ButtonGroup,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ModalAgregarEjercicio from '../components/rutinas/ModalAgregarEjercicio';
import {
  obtenerRutinas,
  agregarRutina,
  actualizarRutina,
  obtenerImagenEjercicio,
} from '../services/rutinasService';

const DIAS = [
  { id: 'lunes', label: 'Lun' },
  { id: 'martes', label: 'Mar' },
  { id: 'miercoles', label: 'Mié' },
  { id: 'jueves', label: 'Jue' },
  { id: 'viernes', label: 'Vie' },
  { id: 'sabado', label: 'Sáb' },
  { id: 'domingo', label: 'Dom' },
];

const OBJETIVOS = [
  'Ganar masa muscular',
  'Ganar fuerza',
  'Mejorar resistencia',
  'Acondicionamiento general',
  'Mantener actividad física',
];

/**
 * Pantalla 2 — Crear o editar rutina semanal.
 * Desarrollada con 90% componentes y utilidades nativas de Bootstrap.
 */
function FormularioRutinaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState(OBJETIVOS[0]);
  const [nivel, setNivel] = useState('Principiante'); // Principiante | Intermedio | Avanzado
  const [diasSeleccionados, setDiasSeleccionados] = useState(['lunes', 'miercoles', 'viernes']);
  const [diaActivo, setDiaActivo] = useState('lunes');
  const [ejerciciosPorDia, setEjerciciosPorDia] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      const rutinas = obtenerRutinas();
      const rutina = rutinas.find((r) => r.id === parseInt(id, 10));
      if (rutina) {
        setNombre(rutina.nombre || '');
        setObjetivo(rutina.objetivo || OBJETIVOS[0]);
        setNivel(rutina.nivel || 'Principiante');
        setDiasSeleccionados(rutina.diasSeleccionados || []);
        setEjerciciosPorDia(rutina.dias || {});
        if (rutina.diasSeleccionados?.length > 0) {
          setDiaActivo(rutina.diasSeleccionados[0]);
        }
      }
    }
  }, [id, esEdicion]);

  const toggleDia = (diaId) => {
    setDiasSeleccionados((prev) => {
      if (prev.includes(diaId)) {
        return prev.filter((d) => d !== diaId);
      }
      return [...prev, diaId];
    });
    setDiaActivo(diaId);
  };

  const handleAgregarEjercicio = (ejercicio) => {
    setEjerciciosPorDia((prev) => ({
      ...prev,
      [diaActivo]: [...(prev[diaActivo] || []), ejercicio],
    }));
  };

  const handleEliminarEjercicio = (indice) => {
    setEjerciciosPorDia((prev) => {
      const nuevaLista = [...(prev[diaActivo] || [])];
      nuevaLista.splice(indice, 1);
      return { ...prev, [diaActivo]: nuevaLista };
    });
  };

  const handleEditarEjercicio = (indice) => {
    const actual = ejerciciosPorDia[diaActivo]?.[indice];
    if (!actual) return;

    Swal.fire({
      title: `Editar ${actual.nombre}`,
      html: `
        <div class="text-start">
          <label class="small text-secondary mb-1">Series:</label>
          <input id="swal-series" type="number" min="1" class="form-control bg-dark text-light border-secondary mb-3" value="${actual.series}">
          <label class="small text-secondary mb-1">Repeticiones:</label>
          <input id="swal-reps" type="text" class="form-control bg-dark text-light border-secondary" value="${actual.repeticiones}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#9EF01A',
      cancelButtonColor: '#2A3035',
      background: '#171C20',
      color: '#ffffff',
      preConfirm: () => {
        const s = document.getElementById('swal-series').value;
        const r = document.getElementById('swal-reps').value;
        if (!s || !r) {
          Swal.showValidationMessage('Completá series y repeticiones.');
          return false;
        }
        return { series: parseInt(s, 10), repeticiones: r.trim() };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setEjerciciosPorDia((prev) => {
          const nuevaLista = [...(prev[diaActivo] || [])];
          nuevaLista[indice] = { ...nuevaLista[indice], ...res.value };
          return { ...prev, [diaActivo]: nuevaLista };
        });
      }
    });
  };

  const handleGuardar = () => {
    if (!nombre.trim()) {
      Swal.fire({
        title: 'Atención',
        text: 'Ingresá un nombre para la rutina.',
        icon: 'warning',
        confirmButtonColor: '#9EF01A',
        background: '#171C20',
        color: '#ffffff',
      });
      return;
    }

    if (diasSeleccionados.length === 0) {
      Swal.fire({
        title: 'Atención',
        text: 'Seleccioná al menos un día de entrenamiento.',
        icon: 'warning',
        confirmButtonColor: '#9EF01A',
        background: '#171C20',
        color: '#ffffff',
      });
      return;
    }

    setCargando(true);

    const diasGuardar = {};
    diasSeleccionados.forEach((dia) => {
      diasGuardar[dia] = ejerciciosPorDia[dia] || [];
    });

    // Derivar grupos musculares automáticamente de los ejercicios seleccionados
    const grupos = [
      ...new Set(
        Object.values(diasGuardar)
          .flat()
          .map((e) => e.grupoMuscular)
          .filter(Boolean)
      ),
    ];

    const datos = {
      nombre: nombre.trim(),
      objetivo,
      nivel,
      grupos,
      duracionMin: 45, // duración estimada por defecto
      diasSeleccionados,
      dias: diasGuardar,
    };

    if (esEdicion) {
      actualizarRutina(parseInt(id, 10), datos);
    } else {
      agregarRutina(datos);
    }

    Swal.fire({
      title: esEdicion ? '¡Rutina actualizada!' : '¡Rutina guardada!',
      text: `La rutina "${nombre}" está lista para entrenar.`,
      icon: 'success',
      confirmButtonColor: '#9EF01A',
      background: '#171C20',
      color: '#ffffff',
      timer: 1800,
      showConfirmButton: false,
    });

    setCargando(false);
    navigate('/rutinas');
  };

  const nombreDiaActivo = DIAS.find((d) => d.id === diaActivo)?.label || diaActivo;
  const ejerciciosActuales = ejerciciosPorDia[diaActivo] || [];

  return (
    <Container className="py-3">
      {/* Encabezado con utilidades Bootstrap */}
      <div className="mb-4">
        <span 
          className="text-secondary small text-decoration-none" 
          role="button" 
          onClick={() => navigate('/rutinas')}
        >
          ← Volver a Rutinas
        </span>
        <h1 className="h2 fw-bold text-light mt-1 mb-1">
          {esEdicion ? 'Editar rutina' : 'Crear nueva rutina'}
        </h1>
        <p className="text-secondary small mb-0">
          Armá tu rutina semanal seleccionando los ejercicios.
        </p>
      </div>

      <Row className="g-4">
        {/* Columna 1: Datos básicos y días */}
        <Col lg={5}>
          <Card className="forza-card border-secondary">
            <Card.Body className="p-4">
              <h5 className="fw-bold text-light mb-3">1. Datos básicos</h5>

              <Form.Group className="mb-3">
                <Form.Label className="small text-secondary">Nombre de la rutina</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Hipertrofia o Fuerza"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-black text-light border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small text-secondary">Objetivo</Form.Label>
                <Form.Select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="bg-black text-light border-secondary"
                >
                  {OBJETIVOS.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Selector de nivel de dificultad */}
              <Form.Group className="mb-4">
                <Form.Label className="small text-secondary">Nivel de dificultad</Form.Label>
                <Form.Select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="bg-black text-light border-secondary"
                >
                  <option value="Principiante">🟢 Principiante</option>
                  <option value="Intermedio">🟡 Intermedio</option>
                  <option value="Avanzado">🔴 Avanzado</option>
                </Form.Select>
              </Form.Group>

              {/* Selector de días semanales con ButtonGroup de Bootstrap */}
              <div>
                <Form.Label className="small text-secondary d-block mb-2">
                  Días de entrenamiento
                </Form.Label>
                <div className="d-flex flex-wrap gap-1">
                  {DIAS.map((dia) => {
                    const seleccionado = diasSeleccionados.includes(dia.id);
                    return (
                      <Button
                        key={dia.id}
                        size="sm"
                        variant={seleccionado ? 'success' : 'outline-secondary'}
                        className={`px-3 py-1 fw-bold ${seleccionado ? 'text-dark' : 'text-light border-secondary'}`}
                        style={seleccionado ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' } : {}}
                        onClick={() => toggleDia(dia.id)}
                      >
                        {dia.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna 2: Ejercicios del día */}
        <Col lg={7}>
          <Card className="forza-card border-secondary">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold text-light mb-0">2. Ejercicios del día</h5>
                  {/* Selector de día activo mediante botones compactos */}
                  {diasSeleccionados.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {DIAS.filter((d) => diasSeleccionados.includes(d.id)).map((d) => (
                        <Button
                          key={d.id}
                          size="sm"
                          variant={diaActivo === d.id ? 'primary' : 'outline-secondary'}
                          className={`btn-sm py-0 px-2 small ${diaActivo === d.id ? 'forza-btn-primary' : 'text-secondary border-secondary'}`}
                          onClick={() => setDiaActivo(d.id)}
                        >
                          {d.label} ({ejerciciosPorDia[d.id]?.length || 0})
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  className="forza-btn-primary btn-sm"
                  onClick={() => setShowModal(true)}
                  disabled={diasSeleccionados.length === 0}
                >
                  + Agregar ejercicio
                </Button>
              </div>

              {/* Lista de ejercicios con tarjetas nativas de Bootstrap */}
              {diasSeleccionados.length === 0 ? (
                <div className="text-center py-5 border border-dashed border-secondary rounded">
                  <p className="text-secondary small mb-0">Seleccioná al menos un día en el panel izquierdo.</p>
                </div>
              ) : ejerciciosActuales.length === 0 ? (
                <div className="text-center py-5 border border-dashed border-secondary rounded">
                  <span className="fs-2 mb-2 d-block">🏋️‍♂️</span>
                  <p className="text-secondary small mb-2">No hay ejercicios para el día seleccionado ({nombreDiaActivo}).</p>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="border-secondary text-light"
                    onClick={() => setShowModal(true)}
                  >
                    + Agregar el primer ejercicio
                  </Button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {ejerciciosActuales.map((ej, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center justify-content-between p-2 px-3 bg-black rounded border border-secondary"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-2 overflow-hidden border border-secondary flex-shrink-0"
                          style={{ width: '38px', height: '38px', backgroundColor: '#0D1114' }}
                        >
                          <img
                            src={ej.imagen || obtenerImagenEjercicio(ej)}
                            alt={ej.nombre}
                            loading="lazy"
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div
                            className="w-100 h-100 align-items-center justify-content-center text-secondary"
                            style={{ display: 'none', fontSize: '1.2rem' }}
                          >
                            {ej.icono || '💪'}
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold small text-light">{ej.nombre}</div>
                          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-primary)' }}>{ej.series} series</span> × {ej.repeticiones} reps
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="dark" className="text-secondary border border-secondary d-none d-sm-inline">
                          {ej.grupoMuscular}
                        </Badge>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="px-2 py-1 text-light border-secondary"
                          onClick={() => handleEditarEjercicio(index)}
                          title="Editar series y repeticiones"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="px-2 py-1"
                          onClick={() => handleEliminarEjercicio(index)}
                          title="Quitar ejercicio"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones finales */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="outline-secondary" onClick={() => navigate('/rutinas')}>
          Cancelar
        </Button>
        <Button className="forza-btn-primary" onClick={handleGuardar} disabled={cargando}>
          {cargando ? <Spinner size="sm" /> : esEdicion ? 'Actualizar rutina' : 'Guardar rutina'}
        </Button>
      </div>

      <ModalAgregarEjercicio
        show={showModal}
        onClose={() => setShowModal(false)}
        onAgregar={handleAgregarEjercicio}
        diaActual={nombreDiaActivo}
      />
    </Container>
  );
}

export default FormularioRutinaPage;
