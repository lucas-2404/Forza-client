import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

/**
 * Página de Registro de Usuario adaptada con React Bootstrap.
 * Utiliza: Container, Row, Col, Card, Form, Button y Spinner.
 */
function RegisterPage() {
  // Estados controlados para cada input del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

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

    // Objeto con los datos iniciales del usuario para el perfil
    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      nivel: 'Principiante',
      objetivo: 'Hipertrofia muscular y fuerza',
      peso: '70',
      altura: '170',
    };

    try {
      // Petición POST al backend para registrar al usuario
      await api.post('/auth/register', {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        password: nuevoUsuario.password,
      });

      // Guardamos el usuario registrado en localStorage para recordar sus datos al iniciar sesión
      localStorage.setItem('forza_registered_user', JSON.stringify(nuevoUsuario));

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta fue creada correctamente. Ahora podés iniciar sesión.',
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
        localStorage.setItem('forza_registered_user', JSON.stringify(nuevoUsuario));

        await Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada con éxito!',
          text: 'Tus datos se guardaron correctamente. Ya podés iniciar sesión.',
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
        <Col md={8} lg={6}>
          <Card className="forza-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">⚡</div>
                <h1 className="h3 fw-bold text-light">Crear Cuenta</h1>
                <p className="text-secondary small">
                  Unite a FORZA y comenzá a organizar tus rutinas de entrenamiento.
                </p>
              </div>

              {/* Formulario controlado con React Bootstrap */}
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="registerNombre">
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

                <Form.Group className="mb-3" controlId="registerEmail">
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

                <Row className="mb-3 g-3">
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

                <Button
                  type="submit"
                  className="forza-btn-primary w-100 mt-2 d-flex align-items-center justify-content-center"
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
                    'Crear mi Cuenta'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
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
