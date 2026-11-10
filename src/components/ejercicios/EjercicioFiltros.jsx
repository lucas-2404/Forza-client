import { Row, Col, Form, Button } from 'react-bootstrap';

export const GRUPOS_MUSCULARES = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
export const DIFICULTADES = ['Principiante', 'Intermedio', 'Avanzado'];

const campoOscuro = 'bg-dark text-light border-secondary';

/**
 * Filtros del catálogo: búsqueda por texto, grupo muscular,
 * dificultad y "solo favoritos".
 * Recibe los valores actuales y avisa cada cambio con onChange(clave, valor).
 */
function EjercicioFiltros({ filtros, onChange, onLimpiar, hayFiltrosActivos }) {
    return (
        <Row className="g-3 align-items-end mb-4">
            <Col xs={12} lg={3}>
                <Form.Label htmlFor="filtro-busqueda" className="small text-secondary mb-1">
                    Buscar
                </Form.Label>
                <Form.Control
                    id="filtro-busqueda"
                    type="search"
                    placeholder="Nombre o descripción"
                    value={filtros.q}
                    onChange={(e) => onChange('q', e.target.value)}
                    className={campoOscuro}
                />
            </Col>

            <Col xs={6} lg={3}>
                <Form.Label htmlFor="filtro-grupo" className="small text-secondary mb-1">
                    Grupo muscular
                </Form.Label>
                <Form.Select
                    id="filtro-grupo"
                    value={filtros.grupo}
                    onChange={(e) => onChange('grupo', e.target.value)}
                    className={campoOscuro}
                >
                    <option value="">Todos</option>
                    {GRUPOS_MUSCULARES.map((grupo) => (
                        <option key={grupo} value={grupo}>{grupo}</option>
                    ))}
                </Form.Select>
            </Col>

            <Col xs={6} lg={2}>
                <Form.Label htmlFor="filtro-dificultad" className="small text-secondary mb-1">
                    Dificultad
                </Form.Label>
                <Form.Select
                    id="filtro-dificultad"
                    value={filtros.dificultad}
                    onChange={(e) => onChange('dificultad', e.target.value)}
                    className={campoOscuro}
                >
                    <option value="">Todas</option>
                    {DIFICULTADES.map((nivel) => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                </Form.Select>
            </Col>

            <Col xs={12} lg={4} className="d-flex align-items-center justify-content-between gap-2">
                <Form.Check
                    type="switch"
                    id="filtro-favoritos"
                    label="Solo favoritos"
                    className="text-light mb-0 text-nowrap"
                    checked={filtros.favoritos}
                    onChange={(e) => onChange('favoritos', e.target.checked ? '1' : '')}
                />
                {hayFiltrosActivos && (
                    <Button size="sm" className="forza-btn-outline text-nowrap" onClick={onLimpiar}>
                        Limpiar filtros
                    </Button>
                )}
            </Col>
        </Row>
    );
}

export default EjercicioFiltros;