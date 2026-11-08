import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ProgressBar,
  Spinner,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

// Opciones para el selector visual de Objetivo Principal
const OBJETIVOS_DISPONIBLES = [
  { id: 'Ganar Masa Muscular', icono: '💪', titulo: 'Ganar Masa Muscular' },
  { id: 'Pérdida de Peso', icono: '🔥', titulo: 'Pérdida de Peso' },
  { id: 'Fuerza y Resistencia', icono: '⚡', titulo: 'Fuerza y Resistencia' },
];

/**
 * Página de Registro de Atleta con selector de objetivos y barra de seguridad.
 * Utiliza: Container, Row, Col, Card, Form, Button, Badge, ProgressBar y Spinner.
 */
function RegisterPage() {
  // Estados controlados para cada input del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [objetivo, setObjetivo] = useState('Ganar Masa Muscular');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // Calcular el porcentaje y color de la barra de seguridad según la longitud de la contraseña
  const calcularSeguridadPassword = () => {
    if (password.length === 0) {
      return { porcentaje: 0, variante: 'secondary', texto: 'Ingresá al menos 6 caracteres' };
    }
    if (password.length < 6) {
      return { porcentaje: 35, variante: 'danger', texto: 'Seguridad baja (mínimo 6 caracteres)' };
    }
    if (password.length < 10) {
      return { porcentaje: 70, variante: 'warning', texto: 'Seguridad media' };
    }
    return { porcentaje: 100, variante: 'success', texto: 'Seguridad alta' };
  };

  const seguridad = calcularSeguridadPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validar que ningún campo esté vacío
    if (!nombre.trim() || !email.trim() || !password || !confirmarPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completá todos los datos del formulario.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    // 2. Validar formato de correo electrónico
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Ingresá una dirección de correo electrónico válida.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    // 3. Validar longitud mínima de 6 caracteres en la contraseña
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    // 4. Validar que ambas contraseñas coincidan
    if (password !== confirmarPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Verificá que la contraseña y su confirmación sean iguales.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    setCargando(true);

    // Objeto con los datos iniciales del atleta incluyendo el objetivo elegido
    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      nivel: 'Principiante',
      objetivo,
      peso: '75',
      altura: '175',
    };

    try {
      // Petición POST al backend para registrar al usuario
      await api.post('/auth/register', {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        password: nuevoUsuario.password,
        objetivo: nuevoUsuario.objetivo,
      });

      // Guardar en localStorage para persistir los datos del atleta
      localStorage.setItem('forza_user', JSON.stringify(nuevoUsuario));
      localStorage.setItem('forza_registered_user', JSON.stringify(nuevoUsuario));

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: `Cuenta creada con el objetivo: ${nuevoUsuario.objetivo}. Ahora podés iniciar sesión.`,
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });

      navigate('/login');
    } catch (error) {
      // Si el backend responde con un error específico (por ejemplo, email ya registrado)
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear la cuenta',
          text: error.response.data?.mensaje || 'Ocurrió un error al registrar el usuario.',
          background: '#141414',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });
      } else {
        // Fallback en localStorage cuando el backend aún no está encendido
        localStorage.setItem('forza_user', JSON.stringify(nuevoUsuario));
        localStorage.setItem('forza_registered_user', JSON.stringify(nuevoUsuario));

        await Swal.fire({
          icon: 'success',
          title: '¡Cuenta de Atleta Creada!',
          text: `Tus datos y tu objetivo (${nuevoUsuario.objetivo}) se guardaron correctamente.`,
          background: '#141414',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });

        navigate('/login');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="forza-card">
            <Card.Body className="p-4 p-lg-5">
              <div className="text-center mb-4">
                <Badge className="forza-badge mb-2">⚡ NUEVO ATLETA</Badge>
                <h1 className="h3 fw-bold text-light mb-1">Crear Cuenta en FORZA</h1>
                <p className="text-secondary small mb-0">
                  Completá tus datos y seleccioná tu meta principal de entrenamiento.
                </p>
              </div>

              {/* Formulario controlado en grilla de 2 columnas con React Bootstrap */}
              <Form onSubmit={handleSubmit} noValidate>
                {/* Fila 1: Nombre Completo y Correo Electrónico */}
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="registerNombre">
                      <Form.Label className="forza-form-label">Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        className="forza-form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registerEmail">
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

                {/* Fila 2: Contraseña y Confirmar Contraseña */}
                <Row className="g-3 mb-2">
                  <Col md={6}>
                    <Form.Group controlId="registerPassword">
                      <Form.Label className="forza-form-label">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="forza-form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registerPasswordConfirm">
                      <Form.Label className="forza-form-label">Confirmar Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Repite la contraseña"
                        className="forza-form-control"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Barra de progreso para indicar la seguridad de la contraseña */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-secondary small">Nivel de seguridad:</span>
                    <span className="text-secondary small fw-bold">{seguridad.texto}</span>
                  </div>
                  <ProgressBar
                    now={seguridad.porcentaje}
                    variant={seguridad.variante}
                    style={{ height: '6px', backgroundColor: '#0D1114' }}
                  />
                </div>

                {/* Selector visual de Objetivo Principal (3 tarjetas/botones seleccionables) */}
                <Form.Group className="mb-4">
                  <Form.Label className="forza-form-label d-block mb-2">
                    Seleccioná tu Objetivo Principal
                  </Form.Label>
                  <Row className="g-3">
                    {OBJETIVOS_DISPONIBLES.map((item) => {
                      const seleccionado = objetivo === item.id;
                      return (
                        <Col sm={4} key={item.id}>
                          <Button
                            type="button"
                            onClick={() => setObjetivo(item.id)}
                            className="w-100 p-3 d-flex flex-column align-items-center justify-content-center gap-1"
                            style={{
                              backgroundColor: seleccionado
                                ? 'var(--color-primary-dark, #192704)'
                                : 'var(--bg-sidebar, #0D1114)',
                              border: seleccionado
                                ? '2px solid #9EF01A'
                                : '1px solid var(--border-color, #2A3035)',
                              color: seleccionado ? '#9EF01A' : '#FFFFFF',
                              borderRadius: '12px',
                            }}
                          >
                            <span className="fs-4">{item.icono}</span>
                            <span className="small fw-bold text-center">{item.titulo}</span>
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                </Form.Group>

                <Button
                  type="submit"
                  className="forza-btn-primary w-100 d-flex align-items-center justify-content-center"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear mi Cuenta de Atleta'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-2 border-top border-secondary">
                <span className="text-secondary small">¿Ya tenés cuenta? </span>
                <Link to="/login" className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                  Iniciá sesión
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
