import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

/**
 * Página de Perfil de Usuario (Dashboard de Atleta + Cálculo de IMC en vivo).
 * Utiliza: Container, Row, Col, Card, Form, Button, Badge y Spinner de React Bootstrap.
 */
function PerfilPage() {
  // Estado para verificar si existe una sesión activa en localStorage
  const [sesionActiva, setSesionActiva] = useState(false);

  // Estados dinámicos para los datos del perfil del atleta
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState('Intermedio');
  const [objetivo, setObjetivo] = useState('Ganar Masa Muscular');
  const [peso, setPeso] = useState('75');
  const [altura, setAltura] = useState('175');
  const [guardando, setGuardando] = useState(false);

  const navigate = useNavigate();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const cargarDatosPerfil = async () => {
      // 1. Verificar si hay usuario activo en localStorage (forza_user)
      const usuarioLocalJSON = localStorage.getItem('forza_user');
      if (!usuarioLocalJSON) {
        setSesionActiva(false);
        return;
      }

      try {
        const usuarioLocal = JSON.parse(usuarioLocalJSON);
        if (usuarioLocal && (usuarioLocal.email || usuarioLocal.nombre)) {
          setSesionActiva(true);
          setNombre(usuarioLocal.nombre || 'Atleta FORZA');
          setEmail(usuarioLocal.email || '');
          setNivel(usuarioLocal.nivel || 'Intermedio');
          setObjetivo(usuarioLocal.objetivo || 'Ganar Masa Muscular');
          setPeso(usuarioLocal.peso ? String(usuarioLocal.peso) : '75');
          setAltura(usuarioLocal.altura ? String(usuarioLocal.altura) : '175');
        } else {
          setSesionActiva(false);
          return;
        }
      } catch {
        setSesionActiva(false);
        return;
      }

      // 2. Si hay un token, intentar sincronizar con la API del backend
      const token = localStorage.getItem('forza_token');
      if (token) {
        try {
          const respuesta = await api.get('/usuarios/perfil');
          const datos = respuesta.data?.usuario || respuesta.data;
          if (datos && datos.email) {
            setNombre(datos.nombre || 'Atleta FORZA');
            setEmail(datos.email);
            setNivel(datos.nivel || 'Intermedio');
            setObjetivo(datos.objetivo || 'Ganar Masa Muscular');
            setPeso(datos.peso ? String(datos.peso) : '75');
            setAltura(datos.altura ? String(datos.altura) : '175');
            localStorage.setItem('forza_user', JSON.stringify(datos));
          }
        } catch {
          // Si el backend está apagado, se mantienen los datos cargados de localStorage
        }
      }
    };

    cargarDatosPerfil();
  }, []);

  // Obtener las iniciales del nombre del usuario para el avatar circular
  const obtenerIniciales = () => {
    if (!nombre || !nombre.trim()) return 'FZ';
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.trim().slice(0, 2).toUpperCase();
  };

  // Calcular el Índice de Masa Corporal (IMC) automáticamente en vivo
  const calcularIMC = () => {
    const pesoNum = parseFloat(peso);
    const alturaMetros = parseFloat(altura) / 100;

    if (!pesoNum || !alturaMetros || pesoNum <= 0 || alturaMetros <= 0) {
      return '-';
    }

    const imc = pesoNum / (alturaMetros * alturaMetros);
    return imc.toFixed(1);
  };

  // Guardar los cambios del formulario de configuración y biometría
  const handleGuardarPerfil = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos obligatorios',
        text: 'El nombre de usuario y el correo electrónico no pueden estar vacíos.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    setGuardando(true);

    // Conservar la contraseña previa en localStorage si existía
    let passwordPrevia = undefined;
    try {
      const previo = JSON.parse(localStorage.getItem('forza_user') || '{}');
      passwordPrevia = previo.password;
    } catch {
      passwordPrevia = undefined;
    }

    const perfilActualizado = {
      nombre: nombre.trim(),
      email: email.trim(),
      nivel,
      objetivo,
      peso,
      altura,
      ...(passwordPrevia ? { password: passwordPrevia } : {}),
    };

    try {
      // Enviar actualización PUT al backend
      await api.put('/usuarios/perfil', perfilActualizado);
    } catch {
      // Fallback: si el backend no responde, actualizamos igualmente en localStorage
    } finally {
      // Guardar en localStorage y reflejar los datos actualizados en vivo
      localStorage.setItem('forza_user', JSON.stringify(perfilActualizado));
      localStorage.setItem('forza_registered_user', JSON.stringify(perfilActualizado));
      setNombre(perfilActualizado.nombre);
      setEmail(perfilActualizado.email);
      setGuardando(false);

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus datos biométricos y preferencias de entrenamiento se guardaron con éxito.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
    }
  };

  // Cerrar sesión limpiando localStorage y redirigiendo a /login
  const handleCerrarSesion = () => {
    localStorage.removeItem('forza_token');
    localStorage.removeItem('forza_user');
    setSesionActiva(false);
    navigate('/login');
  };

  // Si NO hay sesión activa en localStorage, mostramos tarjeta de acceso a Login y Registro
  if (!sesionActiva) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="forza-card text-center">
              <Card.Body className="p-4">
                <div className="fs-1 mb-3">🔒</div>
                <h1 className="h4 fw-bold text-light mb-2">Iniciá sesión para ver tu perfil</h1>
                <p className="text-secondary mb-4">
                  Necesitás tener una sesión activa en FORZA para consultar tu credencial de
                  atleta, calcular tu IMC y editar tu biometría.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button as={Link} to="/login" className="forza-btn-primary">
                    Iniciar Sesión
                  </Button>
                  <Button as={Link} to="/registro" className="forza-btn-outline">
                    Crear Cuenta
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-light mb-1">⚡ Mi Perfil de Atleta</h1>
        <p className="text-secondary small mb-0">
          Consultá tu credencial deportiva, índice de masa corporal (IMC) y configurá tus metas.
        </p>
      </div>

      <Row className="g-4">
        {/* Columna Izquierda (lg={4}): Tarjeta Credencial del Atleta */}
        <Col lg={4}>
          <Card className="forza-card text-center">
            <Card.Body className="p-4 d-flex flex-column justify-content-between h-100">
              <div>
                {/* Avatar circular grande con iniciales y borde #9EF01A */}
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fw-bold"
                  style={{
                    width: '96px',
                    height: '96px',
                    backgroundColor: 'var(--color-primary-dark, #192704)',
                    border: '2px solid #9EF01A',
                    color: '#9EF01A',
                    fontSize: '2rem',
                    letterSpacing: '1px',
                  }}
                >
                  {obtenerIniciales()}
                </div>

                <h2 className="h4 fw-bold text-light mb-1">{nombre}</h2>
                <p className="text-secondary small mb-3">{email}</p>

                {/* Badges con Objetivo actual y Nivel */}
                <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
                  <Badge className="forza-badge">🎯 {objetivo}</Badge>
                  <Badge className="forza-badge">{nivel}</Badge>
                </div>

                {/* Grilla de 3 cajas pequeñas: Peso, Altura e IMC calculado en vivo */}
                <Row className="g-2 mb-4">
                  <Col xs={4}>
                    <div
                      className="p-2 rounded border border-secondary"
                      style={{ backgroundColor: '#0D1114' }}
                    >
                      <span className="text-secondary small d-block">Peso</span>
                      <strong className="text-light">{peso ? `${peso} kg` : '-'}</strong>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div
                      className="p-2 rounded border border-secondary"
                      style={{ backgroundColor: '#0D1114' }}
                    >
                      <span className="text-secondary small d-block">Altura</span>
                      <strong className="text-light">{altura ? `${altura} cm` : '-'}</strong>
                    </div>
                  </Col>

                  <Col xs={4}>
                    <div
                      className="p-2 rounded"
                      style={{
                        backgroundColor: 'var(--color-primary-dark, #192704)',
                        border: '1px solid #9EF01A',
                      }}
                    >
                      <span className="small d-block" style={{ color: '#9EF01A' }}>
                        IMC
                      </span>
                      <strong style={{ color: '#9EF01A' }}>{calcularIMC()}</strong>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Botón inferior de Cerrar Sesión */}
              <Button
                type="button"
                variant="outline-danger"
                onClick={handleCerrarSesion}
                className="w-100 fw-bold mt-2"
              >
                Cerrar Sesión
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna Derecha (lg={8}): Formulario de Configuración y Biometría */}
        <Col lg={8}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <h3 className="h5 fw-bold text-light mb-3 pb-2 border-bottom border-secondary">
                Configuración Personal y Biometría
              </h3>

              <Form onSubmit={handleGuardarPerfil} noValidate>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="perfilNombre">
                      <Form.Label className="forza-form-label">Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Tu nombre completo"
                        className="forza-form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="perfilEmail">
                      <Form.Label className="forza-form-label">Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="tu@email.com"
                        className="forza-form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="perfilPeso">
                      <Form.Label className="forza-form-label">Peso Corporal (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        min="30"
                        max="250"
                        placeholder="Ej. 75"
                        className="forza-form-control"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="perfilAltura">
                      <Form.Label className="forza-form-label">Altura (cm)</Form.Label>
                      <Form.Control
                        type="number"
                        min="100"
                        max="230"
                        placeholder="Ej. 175"
                        className="forza-form-control"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group controlId="perfilNivel">
                      <Form.Label className="forza-form-label">Nivel de Experiencia</Form.Label>
                      <Form.Select
                        className="forza-form-control"
                        value={nivel}
                        onChange={(e) => setNivel(e.target.value)}
                      >
                        <option value="Principiante" className="bg-dark text-light">
                          Principiante
                        </option>
                        <option value="Intermedio" className="bg-dark text-light">
                          Intermedio
                        </option>
                        <option value="Avanzado" className="bg-dark text-light">
                          Avanzado
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="perfilObjetivo">
                      <Form.Label className="forza-form-label">Objetivo Principal</Form.Label>
                      <Form.Select
                        className="forza-form-control"
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                      >
                        <option value="Ganar Masa Muscular" className="bg-dark text-light">
                          Ganar Masa Muscular
                        </option>
                        <option value="Pérdida de Peso" className="bg-dark text-light">
                          Pérdida de Peso
                        </option>
                        <option value="Fuerza y Resistencia" className="bg-dark text-light">
                          Fuerza y Resistencia
                        </option>
                        <option
                          value="Hipertrofia muscular y fuerza"
                          className="bg-dark text-light"
                        >
                          Hipertrofia muscular y fuerza
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="forza-btn-primary w-100 d-flex align-items-center justify-content-center"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Guardando cambios...
                    </>
                  ) : (
                    'Guardar Cambios del Perfil'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PerfilPage;
