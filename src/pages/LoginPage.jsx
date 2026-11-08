import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

/**
 * Página de Inicio de Sesión (Login) con diseño Split-Card.
 * Utiliza: Container, Row, Col, Card, Form, InputGroup, Button, Badge y Spinner de React Bootstrap.
 */
function LoginPage() {
  // Estados controlados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // Botón rápido para autocompletar credenciales de prueba en la presentación
  const handleCompletarDemo = () => {
    setEmail('atleta@forza.app');
    setPassword('forza123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validar que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completá tu correo electrónico y contraseña.',
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });
      return;
    }

    // 2. Validar formato básico de correo electrónico
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

    // 3. Validar longitud mínima de la contraseña
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

    setCargando(true);

    try {
      // Petición POST al backend
      const respuesta = await api.post('/auth/login', { email, password });

      const token = respuesta.data?.token || 'forza_token_activo';
      const usuario = respuesta.data?.usuario || respuesta.data?.user || {
        nombre: email === 'atleta@forza.app' ? 'Atleta Demo' : email.split('@')[0],
        email,
        nivel: 'Intermedio',
        objetivo: 'Ganar Masa Muscular',
        peso: '78',
        altura: '178',
      };

      localStorage.setItem('forza_token', token);
      localStorage.setItem('forza_user', JSON.stringify(usuario));

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido a FORZA!',
        text: `Sesión iniciada correctamente como ${usuario.nombre}.`,
        background: '#141414',
        color: '#ffffff',
        confirmButtonColor: '#9EF01A',
      });

      navigate('/perfil');
    } catch (error) {
      // Si el servidor respondió con un error de credenciales (ej. 401 o 400)
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: error.response.data?.mensaje || 'Correo o contraseña incorrectos.',
          background: '#141414',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });
      } else {
        // Fallback con localStorage si el backend está apagado durante la presentación
        const usuarioGuardadoJSON =
          localStorage.getItem('forza_user') || localStorage.getItem('forza_registered_user');
        let usuarioGuardado = null;

        if (usuarioGuardadoJSON) {
          try {
            usuarioGuardado = JSON.parse(usuarioGuardadoJSON);
          } catch {
            usuarioGuardado = null;
          }
        }

        // Si existe un usuario registrado con ese correo, verificamos su contraseña
        if (
          usuarioGuardado &&
          usuarioGuardado.email === email &&
          usuarioGuardado.password &&
          usuarioGuardado.password !== password
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'La contraseña ingresada no coincide con la cuenta registrada.',
            background: '#141414',
            color: '#ffffff',
            confirmButtonColor: '#9EF01A',
          });
          setCargando(false);
          return;
        }

        // Crear o mantener los datos del usuario en localStorage
        const usuarioActivo =
          usuarioGuardado && usuarioGuardado.email === email
            ? usuarioGuardado
            : {
                nombre: email === 'atleta@forza.app' ? 'Atleta Demo' : email.split('@')[0],
                email,
                nivel: 'Intermedio',
                objetivo: 'Ganar Masa Muscular',
                peso: '78',
                altura: '178',
              };

        localStorage.setItem('forza_token', 'token_local_forza');
        localStorage.setItem('forza_user', JSON.stringify(usuarioActivo));

        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido a FORZA!',
          text: `Hola ${usuarioActivo.nombre}, ingresaste correctamente.`,
          background: '#141414',
          color: '#ffffff',
          confirmButtonColor: '#9EF01A',
        });

        navigate('/perfil');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}>
          <Card className="forza-card overflow-hidden">
            <Row className="g-0">
              {/* Columna Izquierda: Panel Motivacional (Oculto en móviles) */}
              <Col
                md={5}
                className="d-none d-md-flex flex-column justify-content-between p-4 border-end border-secondary"
                style={{ backgroundColor: 'rgba(13, 17, 20, 0.75)' }}
              >
                <div>
                  <Badge className="forza-badge mb-3">⚡ FORZA CLUB</Badge>
                  <h2 className="h3 fw-bold text-light mb-3">
                    Superá tus límites en cada sesión
                  </h2>
                  <p className="text-secondary small mb-4">
                    Tu plataforma de entrenamiento para planificar cargas, organizar rutinas y
                    medir tu evolución física.
                  </p>

                  {/* 3 Puntos clave con tildes en verde lima */}
                  <div className="d-flex flex-column gap-3 mt-4">
                    <div className="d-flex align-items-start gap-2">
                      <span className="fw-bold" style={{ color: '#9EF01A' }}>
                        ✔
                      </span>
                      <div>
                        <strong className="text-light d-block small">
                          Rutinas personalizadas
                        </strong>
                        <span className="text-secondary small">
                          Planes adaptados a tu nivel y objetivo.
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <span className="fw-bold" style={{ color: '#9EF01A' }}>
                        ✔
                      </span>
                      <div>
                        <strong className="text-light d-block small">
                          Seguimiento de progreso
                        </strong>
                        <span className="text-secondary small">
                          Control de series, repeticiones y biometría.
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <span className="fw-bold" style={{ color: '#9EF01A' }}>
                        ✔
                      </span>
                      <div>
                        <strong className="text-light d-block small">
                          Comunidad fitness
                        </strong>
                        <span className="text-secondary small">
                          Entrená con estructura y disciplina diaria.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-top border-secondary pt-3 mt-4">
                  <span className="text-secondary small d-block">
                    🏋️‍♂️ <strong>FORZA Training System</strong>
                  </span>
                </div>
              </Col>

              {/* Columna Derecha: Formulario de Login */}
              <Col md={7}>
                <Card.Body className="p-4 p-lg-5">
                  <div className="mb-4">
                    <h1 className="h3 fw-bold text-light mb-1">Iniciar Sesión</h1>
                    <p className="text-secondary small mb-0">
                      Ingresá tus credenciales para acceder a tu panel de atleta.
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="loginEmail">
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

                    <Form.Group className="mb-4" controlId="loginPassword">
                      <Form.Label className="forza-form-label">Contraseña</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={mostrarPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="forza-form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          className="forza-btn-secondary px-3"
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                          {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-grid gap-2">
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
                            Ingresando...
                          </>
                        ) : (
                          'Ingresar a la Plataforma'
                        )}
                      </Button>

                      <Button
                        type="button"
                        className="forza-btn-outline w-100 btn-sm"
                        onClick={handleCompletarDemo}
                      >
                        ⚡ Completar Usuario Demo
                      </Button>
                    </div>
                  </Form>

                  <div className="text-center mt-4 pt-2 border-top border-secondary">
                    <span className="text-secondary small">¿No tenés cuenta? </span>
                    <Link
                      to="/registro"
                      className="fw-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Registrate acá
                    </Link>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
