import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { EjercicioCard, EjercicioFiltros } from '../components/ejercicios';
import { getEjercicios } from '../services/ejerciciosService';
import { useFavoritos } from '../hooks/useFavoritos';

/**
 * Catálogo de ejercicios con búsqueda, filtros y favoritos.
 * Los filtros se guardan en la URL (?q=&grupo=&dificultad=&favoritos=1),
 * así se mantienen al recargar o al compartir el link.
 */
function EjerciciosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtros = {
    q: searchParams.get('q') ?? '',
    grupo: searchParams.get('grupo') ?? '',
    dificultad: searchParams.get('dificultad') ?? '',
    favoritos: searchParams.get('favoritos') === '1',
  };

  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState(filtros.q);
  const { esFavorito, toggleFavorito } = useFavoritos();

  // Espera 300 ms después de la última tecla antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => setBusqueda(filtros.q), 300);
    return () => clearTimeout(timer);
  }, [filtros.q]);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    getEjercicios({ q: busqueda, grupo: filtros.grupo, dificultad: filtros.dificultad })
      .then((data) => {
        if (!cancelado) setEjercicios(data);
      })
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar los ejercicios. Revisá tu conexión e intentá de nuevo.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [busqueda, filtros.grupo, filtros.dificultad]);

  const actualizarFiltro = (clave, valor) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (valor) next.set(clave, valor);
        else next.delete(clave);
        return next;
      },
      { replace: true }
    );
  };

  const limpiarFiltros = () => setSearchParams({}, { replace: true });

  const hayFiltrosActivos = Boolean(
    filtros.q || filtros.grupo || filtros.dificultad || filtros.favoritos
  );

  const visibles = filtros.favoritos
    ? ejercicios.filter((e) => esFavorito(e.id))
    : ejercicios;

  return (
    <Container className="py-2">
      <div className="mb-4">
        <h1 className="h3 fw-bold text-light mb-1">Biblioteca de Ejercicios</h1>
        <p className="text-secondary mb-0">
          Buscá ejercicios por nombre, grupo muscular o dificultad, y guardá tus favoritos.
        </p>
      </div>

      <EjercicioFiltros
        filtros={filtros}
        onChange={actualizarFiltro}
        onLimpiar={limpiarFiltros}
        hayFiltrosActivos={hayFiltrosActivos}
      />

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" role="status">
            <span className="visually-hidden">Cargando ejercicios...</span>
          </Spinner>
        </div>
      )}

      {!cargando && error && <Alert variant="danger">{error}</Alert>}

      {!cargando && !error && visibles.length === 0 && (
        <div className="text-center py-5">
          <p className="text-light mb-2">
            {filtros.favoritos && !filtros.q && !filtros.grupo && !filtros.dificultad
              ? 'Todavía no marcaste ningún ejercicio como favorito.'
              : 'No hay ejercicios que coincidan con estos filtros.'}
          </p>
          {hayFiltrosActivos && (
            <Button className="forza-btn-outline btn-sm" onClick={limpiarFiltros}>
              Ver todos los ejercicios
            </Button>
          )}
        </div>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <>
          <p className="small text-secondary mb-3">
            {visibles.length} {visibles.length === 1 ? 'ejercicio' : 'ejercicios'}
          </p>
          <Row className="g-4">
            {visibles.map((ejercicio) => (
              <Col md={6} lg={4} key={ejercicio.id}>
                <EjercicioCard
                  ejercicio={ejercicio}
                  esFavorito={esFavorito(ejercicio.id)}
                  onToggleFavorito={toggleFavorito}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default EjerciciosPage;