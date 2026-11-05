import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

/**
 * Página de Inicio de Sesión (Login) adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Form, Button y Spinner.
 */
function LoginPage() {
  // Estados controlados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

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
        nombre: email.split('@')[0],
        email,
        nivel: 'Intermedio',
        objetivo: 'Hipertrofia muscular y fuerza',
        peso: '75',
        altura: '175',
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

      navigate('/dashboard');
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
                nombre: email.split('@')[0],
                email,
                nivel: 'Intermedio',
                objetivo: 'Hipertrofia muscular y fuerza',
                peso: '75',
                altura: '175',
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

        navigate('/dashboard');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">🔐</div>
                <h1 className="h3 fw-bold text-light">Iniciar Sesión</h1>
                <p className="text-secondary small">
                  Ingresá tus credenciales para acceder a FORZA.
                </p>
              </div>

              {/* Formulario controlado utilizando componentes Form de React Bootstrap */}
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
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    className="forza-form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
                      Ingresando...
                    </>
                  ) : (
                    'Ingresar a la Plataforma'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <span className="text-secondary small">¿No tenés cuenta? </span>
                <Link to="/registro" className="fw-bold" style={{ color: 'var(--color-primary)' }}>
                  Registrate acá
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
