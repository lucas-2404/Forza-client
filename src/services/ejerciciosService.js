import api from './api';
import { ejerciciosIniciales } from '../data/ejercicios';

/**
 * Servicio de Ejercicios y Favoritos.
 *
 * Mientras el backend no esté listo, trabaja con los datos de prueba
 * de src/data/ejercicios.js y guarda los favoritos en localStorage.
 * Para usar la API real, poner VITE_USE_MOCK=false en el .env.
 * Las páginas no cambian: siempre llaman a estas mismas funciones.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const FAVORITOS_KEY = 'forza_favoritos_ejercicios';

// Quita tildes y pasa a minúsculas para comparar sin errores ("Tríceps" = "triceps")
const normalizar = (texto = '') =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filtrarLocal(ejercicios, { q, grupo, dificultad } = {}) {
    return ejercicios.filter((e) => {
        if (grupo && !normalizar(e.grupoMuscular).includes(normalizar(grupo))) return false;
        if (dificultad && normalizar(e.dificultad) !== normalizar(dificultad)) return false;
        if (q) {
            const busqueda = normalizar(q);
            const coincide =
                normalizar(e.nombre).includes(busqueda) ||
                normalizar(e.descripcion).includes(busqueda);
            if (!coincide) return false;
        }
        return true;
    });
}

const quitarVacios = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

/* ---------- Ejercicios ---------- */

/**
 * Lista ejercicios con filtros opcionales.
 * @param {{ q?: string, grupo?: string, dificultad?: string }} filtros
 * API: GET /ejercicios?q=&grupo=&dificultad=
 */
export async function getEjercicios(filtros = {}) {
    if (USE_MOCK) return filtrarLocal(ejerciciosIniciales, filtros);
    const { data } = await api.get('/ejercicios', { params: quitarVacios(filtros) });
    return data;
}

/** API: GET /ejercicios/:id */
export async function getEjercicioPorId(id) {
    if (USE_MOCK) return ejerciciosIniciales.find((e) => e.id === Number(id)) ?? null;
    const { data } = await api.get(`/ejercicios/${id}`);
    return data;
}

/* ---------- Favoritos ---------- */

function leerFavoritosLocales() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) ?? [];
    } catch {
        return [];
    }
}

function guardarFavoritosLocales(ids) {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(ids));
}

/**
 * Devuelve los ids de los ejercicios favoritos del usuario.
 * API: GET /favoritos  → se espera un array de ejercicios
 */
export async function getFavoritosIds() {
    if (USE_MOCK) return leerFavoritosLocales();
    const { data } = await api.get('/favoritos');
    return data.map((ejercicio) => ejercicio.id);
}

/** API: POST /favoritos/:ejercicioId */
export async function agregarFavorito(id) {
    if (USE_MOCK) {
        const favoritos = leerFavoritosLocales();
        if (!favoritos.includes(id)) guardarFavoritosLocales([...favoritos, id]);
        return;
    }
    await api.post(`/favoritos/${id}`);
}

/** API: DELETE /favoritos/:ejercicioId */
export async function quitarFavorito(id) {
    if (USE_MOCK) {
        guardarFavoritosLocales(leerFavoritosLocales().filter((f) => f !== id));
        return;
    }
    await api.delete(`/favoritos/${id}`);
}