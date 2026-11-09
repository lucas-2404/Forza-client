/**
 * Servicio de Rutinas - FORZA
 * Maneja el almacenamiento de rutinas y entrenamientos en localStorage.
 * Funciones simples y claras para leer, guardar y eliminar datos.
 */

const RUTINAS_KEY = 'forza_rutinas';
const ENTRENAMIENTOS_KEY = 'forza_entrenamientos';

// Datos iniciales de demostración basados exactamente en el Diseño A
const RUTINAS_DEMO = [
  {
    id: 1,
    nombre: 'Hipertrofia',
    objetivo: 'Ganar masa muscular',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    creadaEn: new Date().toISOString(),
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 4, repeticiones: '10', icono: '🏋️‍♂️' },
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 3, repeticiones: '12', icono: '💪' },
      ],
      miercoles: [
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 4, repeticiones: '8', icono: '🦵' },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 3, repeticiones: '10', icono: '⚡' },
      ],
      viernes: [
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 4, repeticiones: '10', icono: '🧗‍♂️' },
        { id: 6, nombre: 'Plancha Abdominal', grupoMuscular: 'Core / Abdomen', series: 3, repeticiones: '60 seg', icono: '⏱️' },
      ],
    },
  },
  {
    id: 2,
    nombre: 'Fuerza',
    objetivo: 'Ganar fuerza',
    diasSeleccionados: ['martes', 'jueves'],
    creadaEn: new Date().toISOString(),
    dias: {
      martes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 5, repeticiones: '5', icono: '🏋️‍♂️' },
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 5, repeticiones: '5', icono: '🦵' },
      ],
      jueves: [
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 5, repeticiones: '5', icono: '⚡' },
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 4, repeticiones: '6', icono: '💪' },
      ],
    },
  },
  {
    id: 3,
    nombre: 'Cuerpo completo',
    objetivo: 'Acondicionamiento general',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    creadaEn: new Date().toISOString(),
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 3, repeticiones: '12', icono: '🏋️‍♂️' },
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 3, repeticiones: '12', icono: '🦵' },
      ],
      miercoles: [
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 3, repeticiones: '10', icono: '🧗‍♂️' },
        { id: 6, nombre: 'Plancha Abdominal', grupoMuscular: 'Core / Abdomen', series: 3, repeticiones: '45 seg', icono: '⏱️' },
      ],
      viernes: [
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 3, repeticiones: '12', icono: '💪' },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 3, repeticiones: '12', icono: '⚡' },
      ],
    },
  },
];

// ─── RUTINAS ─────────────────────────────────────────────────────────────────

/** Obtiene todas las rutinas guardadas en localStorage (o siembra las iniciales de Diseño A) */
export function obtenerRutinas() {
  const datos = localStorage.getItem(RUTINAS_KEY);
  if (!datos) {
    // Si todavía no hay datos en localStorage, inicializamos con los ejemplos del Diseño A
    guardarRutinas(RUTINAS_DEMO);
    return RUTINAS_DEMO;
  }
  return JSON.parse(datos);
}

/** Guarda la lista completa de rutinas en localStorage */
export function guardarRutinas(rutinas) {
  localStorage.setItem(RUTINAS_KEY, JSON.stringify(rutinas));
}

/** Agrega una rutina nueva. Genera un ID único automáticamente. */
export function agregarRutina(rutina) {
  const rutinas = obtenerRutinas();
  const nuevaRutina = {
    ...rutina,
    id: Date.now(),
    creadaEn: new Date().toISOString(),
  };
  rutinas.push(nuevaRutina);
  guardarRutinas(rutinas);
  return nuevaRutina;
}

/** Actualiza una rutina existente por su ID */
export function actualizarRutina(id, datosActualizados) {
  const rutinas = obtenerRutinas();
  const indice = rutinas.findIndex((r) => r.id === id);
  if (indice !== -1) {
    rutinas[indice] = { ...rutinas[indice], ...datosActualizados };
    guardarRutinas(rutinas);
    return rutinas[indice];
  }
  return null;
}

/** Elimina una rutina por su ID */
export function eliminarRutina(id) {
  const rutinas = obtenerRutinas();
  const rutinasFiltradas = rutinas.filter((r) => r.id !== id);
  guardarRutinas(rutinasFiltradas);
}

// ─── ENTRENAMIENTOS ───────────────────────────────────────────────────────────

/** Obtiene el historial de entrenamientos completados */
export function obtenerEntrenamientos() {
  const datos = localStorage.getItem(ENTRENAMIENTOS_KEY);
  return datos ? JSON.parse(datos) : [];
}

/** Registra un entrenamiento completado */
export function registrarEntrenamiento(rutinaId, rutinaNombre, duracionMinutos = 45) {
  const entrenamientos = obtenerEntrenamientos();

  // Verificar si ya se registró hoy para esta rutina (evitar duplicados accidentales)
  const hoy = new Date().toDateString();
  const yaRegistrado = entrenamientos.some(
    (e) => e.rutinaId === rutinaId && new Date(e.fecha).toDateString() === hoy
  );

  if (yaRegistrado) {
    return null; // Retorna null para indicar duplicado
  }

  const nuevoEntrenamiento = {
    id: Date.now(),
    rutinaId,
    rutinaNombre,
    duracionMinutos: Number(duracionMinutos),
    fecha: new Date().toISOString(),
  };

  entrenamientos.push(nuevoEntrenamiento);
  localStorage.setItem(ENTRENAMIENTOS_KEY, JSON.stringify(entrenamientos));
  return nuevoEntrenamiento;
}

// ─── ESTADÍSTICAS ─────────────────────────────────────────────────────────────

/** Calcula estadísticas a partir del historial de entrenamientos y rutinas */
export function calcularEstadisticas() {
  const rutinas = obtenerRutinas();
  const entrenamientos = obtenerEntrenamientos();

  // Entrenamientos de esta semana
  const ahora = new Date();
  const inicioDeSemana = new Date(ahora);
  inicioDeSemana.setDate(ahora.getDate() - ahora.getDay());
  inicioDeSemana.setHours(0, 0, 0, 0);

  const entrenamientosEstaSemana = entrenamientos.filter(
    (e) => new Date(e.fecha) >= inicioDeSemana
  );

  // Entrenamientos de este mes
  const inicioDelMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const entrenamientosEsteMes = entrenamientos.filter(
    (e) => new Date(e.fecha) >= inicioDelMes
  );

  // Duración promedio
  const duracionTotal = entrenamientos.reduce((acc, e) => acc + (e.duracionMinutos || 0), 0);
  const duracionPromedio = entrenamientos.length > 0
    ? Math.round(duracionTotal / entrenamientos.length)
    : 45; // Valor de referencia si aún no hay registros

  return {
    totalRutinas: rutinas.length,
    entrenamientosSemanales: entrenamientosEstaSemana.length,
    duracionPromedio,
    totalEntrenamientos: entrenamientos.length,
    entrenamientosEsteMes: entrenamientosEsteMes.length,
    duracionTotal,
  };
}

/** Obtiene datos de entrenamientos agrupados por las últimas 4 semanas */
export function obtenerEntrenamientosPorSemana() {
  const entrenamientos = obtenerEntrenamientos();
  const semanas = [];

  for (let i = 3; i >= 0; i--) {
    const ahora = new Date();
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay() - i * 7);
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    const cantidad = entrenamientos.filter((e) => {
      const fecha = new Date(e.fecha);
      return fecha >= inicioSemana && fecha <= finSemana;
    }).length;

    semanas.push({
      label: `Sem ${4 - i}`,
      cantidad,
    });
  }

  return semanas;
}
