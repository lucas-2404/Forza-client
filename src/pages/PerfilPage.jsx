import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

/**
 * Página de Perfil de Usuario adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Form, Button, Badge y Spinner de react-bootstrap.
 */
function PerfilPage() {
  // Estado para verificar si existe una sesión activa en localStorage
  const [sesionActiva, setSesionActiva] = useState(false);

  // Estados dinámicos para los datos del perfil del usuario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState('Intermedio');
  const [objetivo, setObjetivo] = useState('Hipertrofia muscular y fuerza');
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
          setNombre(usuarioLocal.nombre || 'Usuario FORZA');
          setEmail(usuarioLocal.email || '');
          setNivel(usuarioLocal.nivel || 'Intermedio');
          setObjetivo(usuarioLocal.objetivo || 'Hipertrofia muscular y fuerza');
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
            setNombre(datos.nombre || 'Usuario FORZA');
            setEmail(datos.email);
            setNivel(datos.nivel || 'Intermedio');
            setObjetivo(datos.objetivo || 'Hipertrofia muscular y fuerza');
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

  // Guardar los cambios del formulario de perfil
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
      objetivo: objetivo.trim() || 'Hipertrofia muscular y fuerza',
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
      // Guardar en localStorage y reflejar los datos actualizados en pantalla
      localStorage.setItem('forza_user', JSON.stringify(perfilActualizado));
      localStorage.setItem('forza_registered_user', JSON.stringify(perfilActualizado));
      setNombre(perfilActualizado.nombre);
      setEmail(perfilActualizado.email);
      setObjetivo(perfilActualizado.objetivo);
      setGuardando(false);

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus datos personales y de entrenamiento se guardaron correctamente.',
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
                  Necesitás tener una sesión activa en FORZA para consultar y editar tus datos
                  personales y objetivos de entrenamiento.
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
    <Container className="py-2">
      <Row className="justify-content-center">
        <Col md={10} lg={7}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              {/* Encabezado dinámico con resumen del usuario */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'var(--color-primary-dark)',
                    border: '2px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    fontSize: '2.5rem',
                  }}
                >
                  👤
                </div>
                <h1 className="h3 fw-bold text-light mb-1">{nombre}</h1>
                <p className="text-secondary small mb-2">{email}</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <Badge className="forza-badge">Miembro Activo</Badge>
                  <Badge className="forza-badge">{nivel}</Badge>
                </div>
              </div>

              {/* Resumen rápido en tarjetas pequeñas */}
              <Row className="g-3 mb-4 text-center border-top border-bottom border-secondary py-3">
                <Col xs={4}>
                  <span className="text-secondary small d-block">Peso</span>
                  <strong className="text-light">{peso ? `${peso} kg` : '-'}</strong>
                </Col>
                <Col xs={4}>
                  <span className="text-secondary small d-block">Altura</span>
                  <strong className="text-light">{altura ? `${altura} cm` : '-'}</strong>
                </Col>
                <Col xs={4}>
                  <span className="text-secondary small d-block">Nivel</span>
                  <strong className="text-light">{nivel}</strong>
                </Col>
              </Row>

              {/* Formulario controlado con React Bootstrap para editar los datos */}
              <Form onSubmit={handleGuardarPerfil} noValidate>
                <Form.Group className="mb-3" controlId="perfilNombre">
                  <Form.Label className="forza-form-label">Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tu nombre completo"
                    className="forza-form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="perfilEmail">
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

                <Row className="g-3 mb-3">
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
                      <Form.Control
                        type="text"
                        placeholder="Ej. Hipertrofia muscular y fuerza"
                        className="forza-form-control"
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
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

                {/* Botones de Guardar Cambios y Cerrar Sesión */}
                <div className="d-grid gap-2">
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
                      'Actualizar Perfil'
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleCerrarSesion}
                    className="forza-btn-secondary w-100 text-danger border-danger"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PerfilPage;
