import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { EjercicioCard } from '../components/ejercicios';
import { getEjercicios } from '../services/ejerciciosService';
import { useFavoritos } from '../hooks/useFavoritos';

/**
 * Página de Favoritos: muestra los ejercicios marcados con el corazón.
 * Al desmarcar uno, desaparece de la lista al instante.
 */
function FavoritosPage() {
    const [ejercicios, setEjercicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { esFavorito, toggleFavorito, cargandoFavoritos } = useFavoritos();

    useEffect(() => {
        let cancelado = false;
        getEjercicios()
            .then((data) => {
                if (!cancelado) setEjercicios(data);
            })
            .catch(() => {
                if (!cancelado) setError('No se pudieron cargar tus favoritos. Revisá tu conexión e intentá de nuevo.');
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const favoritos = ejercicios.filter((e) => esFavorito(e.id));
    const estaCargando = cargando || cargandoFavoritos;

    return (
        <Container className="py-2">
            <div className="mb-4">
                <h1 className="h3 fw-bold text-light mb-1">Mis favoritos</h1>
                <p className="text-secondary mb-0">
                    Los ejercicios que marcaste para tener a mano.
                </p>
            </div>

            {estaCargando && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="light" role="status">
                        <span className="visually-hidden">Cargando favoritos...</span>
                    </Spinner>
                </div>
            )}

            {!estaCargando && error && <Alert variant="danger">{error}</Alert>}

            {!estaCargando && !error && favoritos.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-light mb-3">
                        Todavía no tenés favoritos. Tocá el corazón de un ejercicio para guardarlo acá.
                    </p>
                    <Link to="/ejercicios" className="btn btn-sm forza-btn-outline">
                        Ir a ejercicios
                    </Link>
                </div>
            )}

            {!estaCargando && !error && favoritos.length > 0 && (
                <Row className="g-4">
                    {favoritos.map((ejercicio) => (
                        <Col md={6} lg={4} key={ejercicio.id}>
                            <EjercicioCard
                                ejercicio={ejercicio}
                                esFavorito
                                onToggleFavorito={toggleFavorito}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default FavoritosPage;