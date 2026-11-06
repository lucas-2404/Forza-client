import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    getFavoritosIds,
    agregarFavorito,
    quitarFavorito,
} from '../services/ejerciciosService';

/**
 * Maneja la lista de ejercicios favoritos del usuario.
 * El corazón cambia al instante (actualización optimista) y,
 * si la API falla, vuelve al estado anterior y avisa.
 */
export function useFavoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [cargandoFavoritos, setCargandoFavoritos] = useState(true);

    useEffect(() => {
        let cancelado = false;
        getFavoritosIds()
            .then((ids) => {
                if (!cancelado) setFavoritos(ids);
            })
            .catch(() => {
                if (!cancelado) setFavoritos([]);
            })
            .finally(() => {
                if (!cancelado) setCargandoFavoritos(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const esFavorito = useCallback((id) => favoritos.includes(id), [favoritos]);

    const toggleFavorito = useCallback(
        async (id) => {
            const yaEraFavorito = favoritos.includes(id);

            setFavoritos((prev) =>
                yaEraFavorito ? prev.filter((f) => f !== id) : [...prev, id]
            );

            try {
                if (yaEraFavorito) await quitarFavorito(id);
                else await agregarFavorito(id);
            } catch {
                setFavoritos((prev) =>
                    yaEraFavorito ? [...prev, id] : prev.filter((f) => f !== id)
                );
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo actualizar el favorito',
                    text: 'Revisá tu conexión e intentá de nuevo.',
                    background: '#1f1f1f',
                    color: '#f1f1f1',
                });
            }
        },
        [favoritos]
    );

    return { favoritos, esFavorito, toggleFavorito, cargandoFavoritos };
}