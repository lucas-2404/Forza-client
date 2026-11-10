import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
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
import { EditIcon, TrashIcon } from '../components/layout/Icons';

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
 * FormularioRutinaPage.jsx — Pantalla de Crear / Editar Rutina (Diseño Premium FORZA).
 * Diseño de 2 columnas:
 * - Columna Izquierda: 1. Datos básicos (Nombre, Objetivo, Dificultad, Días)
 * - Columna Derecha: 2. Ejercicios del día (Selector de días, Listado o Empty State elegante)
 */
function FormularioRutinaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState(OBJETIVOS[0]);
  const [nivel, setNivel] = useState('Principiante');
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
        const filtrado = prev.filter((d) => d !== diaId);
        if (diaActivo === diaId && filtrado.length > 0) {
          setDiaActivo(filtrado[0]);
        }
        return filtrado;
      }
      const nuevo = [...prev, diaId];
      setDiaActivo(diaId);
      return nuevo;
    });
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

    const grupos = [
      ...new Set(
        Object.values(diasGuardar)
          .flat()
          .map((e) => e?.grupoMuscular)
          .filter(Boolean)
      ),
    ];

    const datos = {
      nombre: nombre.trim(),
      objetivo,
      nivel,
      grupos,
      duracionMin: 45,
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
      {/* ─── ENCABEZADO CON NAVEGACIÓN Y FOTOGRAFÍA SUPERIOR ────────────────── */}
      <div className="position-relative overflow-hidden mb-4 pb-2">
        <button
          type="button"
          className="btn btn-link text-secondary small p-0 mb-2 text-decoration-none d-flex align-items-center gap-1"
          onClick={() => navigate('/rutinas')}
        >
          <span>←</span>
          <span>Volver a Rutinas</span>
        </button>

        <Row className="align-items-center">
          <Col md={8} lg={7}>
            <h1 className="display-6 fw-bold text-white mb-1">
              {esEdicion ? 'Editar' : 'Crear nueva'}{' '}
              <span style={{ color: 'var(--color-primary)' }}>rutina</span>
            </h1>
            <p className="text-secondary small mb-0">
              Armá tu rutina semanal seleccionando los ejercicios, días y objetivo.
            </p>
          </Col>
        </Row>
      </div>

      {/* ─── CUERPO EN 2 COLUMNAS ───────────────────────────────────────────── */}
      <Row className="g-4">
        {/* Columna Izquierda: 1. Datos básicos */}
        <Col xs={12} lg={5}>
          <Card className="rutina-card h-100 shadow-sm">
            <Card.Body className="p-4 d-flex flex-column">
              <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                1. Datos básicos
              </h5>
              <p className="text-secondary small mb-3">
                Definí la información principal de tu rutina.
              </p>

              <Form.Group className="mb-3">
                <Form.Label className="small text-secondary fw-semibold">
                  Nombre de la rutina
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Hipertrofia o Fuerza"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-black text-light border-secondary py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small text-secondary fw-semibold">
                  Objetivo
                </Form.Label>
                <Form.Select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="bg-black text-light border-secondary py-2"
                >
                  {OBJETIVOS.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small text-secondary fw-semibold">
                  Nivel de dificultad
                </Form.Label>
                <Form.Select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="bg-black text-light border-secondary py-2"
                >
                  <option value="Principiante">🟢 Principiante</option>
                  <option value="Intermedio">🟡 Intermedio</option>
                  <option value="Avanzado">🔴 Avanzado</option>
                </Form.Select>
              </Form.Group>

              {/* Selector de días de entrenamiento */}
              <div>
                <Form.Label className="small text-secondary fw-semibold d-block mb-2">
                  Días de entrenamiento
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {DIAS.map((dia) => {
                    const seleccionado = diasSeleccionados.includes(dia.id);
                    return (
                      <button
                        key={dia.id}
                        type="button"
                        className={`rutina-form-day-btn ${seleccionado ? 'is-selected' : ''}`}
                        onClick={() => toggleDia(dia.id)}
                      >
                        {dia.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna Derecha: 2. Ejercicios del día */}
        <Col xs={12} lg={7}>
          <Card className="rutina-card h-100 shadow-sm">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                    2. Ejercicios del día
                  </h5>
                  <p className="text-secondary small mb-0">
                    Agregá los ejercicios por día y organizá tu rutina semanal.
                  </p>
                </div>
                <Button
                  className="forza-btn-primary btn-sm fw-bold"
                  onClick={() => setShowModal(true)}
                  disabled={diasSeleccionados.length === 0}
                >
                  + Agregar ejercicio
                </Button>
              </div>

              {/* Selector de días con conteo */}
              <div className="d-flex flex-wrap gap-1 mb-3">
                {DIAS.map((d) => {
                  const estaSeleccionado = diasSeleccionados.includes(d.id);
                  const activo = diaActivo === d.id;
                  const count = ejerciciosPorDia[d.id]?.length || 0;

                  return (
                    <button
                      key={d.id}
                      type="button"
                      disabled={!estaSeleccionado}
                      className={`rutina-form-day-btn small py-1 px-2 ${
                        activo && estaSeleccionado
                          ? 'is-selected'
                          : !estaSeleccionado
                          ? 'opacity-25'
                          : ''
                      }`}
                      onClick={() => setDiaActivo(d.id)}
                    >
                      {d.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Contenido de la columna derecha */}
              {diasSeleccionados.length === 0 ? (
                <div className="rutina-form-empty-card my-auto">
                  <p className="text-secondary small mb-0">
                    Seleccioná al menos un día en el panel izquierdo para comenzar.
                  </p>
                </div>
              ) : ejerciciosActuales.length === 0 ? (
                /* Estado vacío elegante con fotografía de gimnasio */
                <div className="rutina-form-empty-card my-auto">
                  <img
                    src="/img/hero-gym.webp"
                    alt=""
                    aria-hidden="true"
                    className="rutina-form-empty-img"
                  />
                  <div className="position-relative z-1">
                    <h5 className="fw-bold text-white mb-2">
                      Todavía no agregaste{' '}
                      <span style={{ color: 'var(--color-primary)' }}>ejercicios</span>
                    </h5>
                    <p className="text-secondary small mb-4 col-md-10 mx-auto">
                      Comenzá a construir tu rutina para el {nombreDiaActivo}. Agregá ejercicios y definí series, repeticiones y descansos.
                    </p>
                    <Button
                      className="forza-btn-primary btn-sm fw-bold px-4"
                      onClick={() => setShowModal(true)}
                    >
                      + Agregar el primer ejercicio
                    </Button>
                  </div>
                </div>
              ) : (
                /* Lista de ejercicios agregados */
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '420px' }}>
                  {ejerciciosActuales.map((ej, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 border border-secondary"
                      style={{ backgroundColor: '#0D1114' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-2 overflow-hidden border border-secondary flex-shrink-0"
                          style={{ width: '42px', height: '42px', backgroundColor: '#080B0D' }}
                        >
                          <img
                            src={ej.imagenFondo || ej.imagen || obtenerImagenEjercicio(ej)}
                            alt={ej.nombre}
                            loading="lazy"
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div className="fw-bold small text-light">{ej.nombre}</div>
                          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-primary)' }}>
                              {ej.series} series
                            </span>{' '}
                            × {ej.repeticiones} reps
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="rutina-muscle-badge d-none d-sm-inline">
                          {ej.grupoMuscular}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary text-secondary p-1 px-2 border-secondary"
                          onClick={() => handleEditarEjercicio(index)}
                          title="Editar series y repeticiones"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          onClick={() => handleEliminarEjercicio(index)}
                          title="Quitar ejercicio"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ─── ACCIONES INFERIORES ─────────────────────────────────────────────── */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="outline-secondary"
          className="border-secondary text-light px-4"
          onClick={() => navigate('/rutinas')}
        >
          Cancelar
        </Button>
        <Button
          className="forza-btn-primary fw-bold px-4"
          onClick={handleGuardar}
          disabled={cargando}
        >
          {cargando ? (
            <Spinner size="sm" />
          ) : esEdicion ? (
            'Actualizar rutina'
          ) : (
            'Guardar rutina'
          )}
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
