/**
 * rutinasService.js — FORZA
 * Servicio central para rutinas, entrenamientos, estadísticas y logros.
 * Almacenamiento en localStorage. Funciones simples y bien documentadas.
 */

const RUTINAS_KEY = 'forza_rutinas';
const ENTRENAMIENTOS_KEY = 'forza_entrenamientos';

// ─── RUTINAS RECOMENDADAS (estáticas, no editables) ───────────────────────────
export const RUTINAS_RECOMENDADAS = [
  {
    id: 'rec-1',
    nombre: 'Push — Empuje',
    descripcion: 'Trabaja pecho, hombros y tríceps con movimientos de empuje compuestos e isolaterales.',
    objetivo: 'Ganar masa muscular',
    diasSemana: 3,
    duracionMin: 55,
    nivel: 'Intermedio',
    grupos: ['Pecho', 'Hombros', 'Tríceps'],
    emoji: '💪',
    imagen: '/img/rutinas/push.jpg',
    colorGradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 60%, #0a1628 100%)',
    accentColor: '#7c3aed',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 4, repeticiones: '8-10', icono: '🏋️‍♂️', imagen: '/img/ejercicios/press-banca.svg', descanso: 90 },
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 4, repeticiones: '10-12', icono: '💪', imagen: '/img/ejercicios/press-militar.svg', descanso: 75 },
        { id: 'ext1', nombre: 'Fondos en Paralelas', grupoMuscular: 'Tríceps', series: 3, repeticiones: '10-15', icono: '🤸', imagen: '/img/ejercicios/fondos.svg', descanso: 60 },
      ],
    },
  },
  {
    id: 'rec-2',
    nombre: 'Pull — Tracción',
    descripcion: 'Enfocada en espalda y bíceps con dominadas, remos y curls para un torso posterior fuerte.',
    objetivo: 'Ganar masa muscular',
    diasSemana: 3,
    duracionMin: 50,
    nivel: 'Intermedio',
    grupos: ['Espalda', 'Bíceps', 'Core'],
    emoji: '🧗‍♂️',
    imagen: '/img/rutinas/pull.jpg',
    colorGradient: 'linear-gradient(135deg, #0d2137 0%, #0a2744 60%, #051b2c 100%)',
    accentColor: '#0ea5e9',
    diasSeleccionados: ['martes', 'jueves', 'sabado'],
    dias: {
      martes: [
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 4, repeticiones: '6-10', icono: '🧗‍♂️', imagen: '/img/ejercicios/dominadas.svg', descanso: 90 },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Espalda Baja', series: 3, repeticiones: '10-12', icono: '⚡', imagen: '/img/ejercicios/peso-muerto.svg', descanso: 90 },
        { id: 'bic1', nombre: 'Curl con Barra', grupoMuscular: 'Bíceps', series: 3, repeticiones: '12', icono: '💪', imagen: '/img/ejercicios/curl-barra.svg', descanso: 60 },
      ],
    },
  },
  {
    id: 'rec-3',
    nombre: 'Piernas — Fuerza',
    descripcion: 'Rutina de piernas con sentadillas, peso muerto y prensa para desarrollar fuerza inferior.',
    objetivo: 'Ganar fuerza',
    diasSemana: 2,
    duracionMin: 65,
    nivel: 'Avanzado',
    grupos: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
    emoji: '🦵',
    imagen: '/img/rutinas/piernas.jpg',
    colorGradient: 'linear-gradient(135deg, #1a1500 0%, #2a1f00 60%, #1a1200 100%)',
    accentColor: '#d97706',
    diasSeleccionados: ['martes', 'viernes'],
    dias: {
      martes: [
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 5, repeticiones: '5-6', icono: '🦵', imagen: '/img/ejercicios/sentadilla.svg', descanso: 120 },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Isquiotibiales', series: 4, repeticiones: '8-10', icono: '⚡', imagen: '/img/ejercicios/peso-muerto.svg', descanso: 90 },
        { id: 'calf1', nombre: 'Elevaciones de Talones', grupoMuscular: 'Pantorrillas', series: 4, repeticiones: '15-20', icono: '🦶', imagen: '/img/ejercicios/gemelos.svg', descanso: 45 },
      ],
    },
  },
  {
    id: 'rec-4',
    nombre: 'Full Body — Fuerza y Masa',
    descripcion: 'Entrena todo el cuerpo en cada sesión con movimientos compuestos de alta eficiencia.',
    objetivo: 'Acondicionamiento general',
    diasSemana: 3,
    duracionMin: 60,
    nivel: 'Principiante',
    grupos: ['Pecho', 'Espalda', 'Piernas', 'Hombros'],
    emoji: '⚡',
    imagen: '/img/rutinas/fullbody.jpg',
    colorGradient: 'linear-gradient(135deg, #0a1a0a 0%, #0d2010 60%, #081508 100%)',
    accentColor: '#9EF01A',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 3, repeticiones: '10-12', icono: '🏋️‍♂️', imagen: '/img/ejercicios/press-banca.svg', descanso: 75 },
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 3, repeticiones: '10-12', icono: '🦵', imagen: '/img/ejercicios/sentadilla.svg', descanso: 90 },
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 3, repeticiones: '8-10', icono: '🧗‍♂️', imagen: '/img/ejercicios/dominadas.svg', descanso: 75 },
        { id: 6, nombre: 'Plancha Abdominal', grupoMuscular: 'Core', series: 3, repeticiones: '45 seg', icono: '⏱️', imagen: '/img/ejercicios/plancha.svg', descanso: 45 },
      ],
    },
  },
];

// ─── RUTINAS (localStorage) ────────────────────────────────────────────────────

const RUTINAS_INICIALES = [
  {
    id: 1,
    nombre: 'Hipertrofia',
    objetivo: 'Ganar masa muscular',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    creadaEn: new Date(Date.now() - 30 * 86400000).toISOString(),
    grupos: ['Pecho', 'Hombros', 'Espalda'],
    duracionMin: 55,
    nivel: 'Intermedio',
    imagen: '/img/rutinas/hipertrofia.jpg',
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 4, repeticiones: '10', icono: '🏋️‍♂️', imagen: '/img/ejercicios/press-banca.svg', descanso: 90 },
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 3, repeticiones: '12', icono: '💪', imagen: '/img/ejercicios/press-militar.svg', descanso: 75 },
      ],
      miercoles: [
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 4, repeticiones: '8', icono: '🦵', imagen: '/img/ejercicios/sentadilla.svg', descanso: 120 },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 3, repeticiones: '10', icono: '⚡', imagen: '/img/ejercicios/peso-muerto.svg', descanso: 90 },
      ],
      viernes: [
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 4, repeticiones: '10', icono: '🧗‍♂️', imagen: '/img/ejercicios/dominadas.svg', descanso: 90 },
        { id: 6, nombre: 'Plancha Abdominal', grupoMuscular: 'Core / Abdomen', series: 3, repeticiones: '60 seg', icono: '⏱️', imagen: '/img/ejercicios/plancha.svg', descanso: 45 },
      ],
    },
  },
  {
    id: 2,
    nombre: 'Fuerza',
    objetivo: 'Ganar fuerza',
    diasSeleccionados: ['martes', 'jueves'],
    creadaEn: new Date(Date.now() - 15 * 86400000).toISOString(),
    grupos: ['Pecho', 'Piernas'],
    duracionMin: 70,
    nivel: 'Avanzado',
    imagen: '/img/rutinas/fuerza.jpg',
    dias: {
      martes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 5, repeticiones: '5', icono: '🏋️‍♂️', imagen: '/img/ejercicios/press-banca.svg', descanso: 120 },
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 5, repeticiones: '5', icono: '🦵', imagen: '/img/ejercicios/sentadilla.svg', descanso: 120 },
      ],
      jueves: [
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 5, repeticiones: '5', icono: '⚡', imagen: '/img/ejercicios/peso-muerto.svg', descanso: 120 },
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 4, repeticiones: '6', icono: '💪', imagen: '/img/ejercicios/press-militar.svg', descanso: 90 },
      ],
    },
  },
  {
    id: 3,
    nombre: 'Cuerpo completo',
    objetivo: 'Acondicionamiento general',
    diasSeleccionados: ['lunes', 'miercoles', 'viernes'],
    creadaEn: new Date(Date.now() - 7 * 86400000).toISOString(),
    grupos: ['Pecho', 'Espalda', 'Piernas', 'Core'],
    duracionMin: 60,
    nivel: 'Principiante',
    imagen: '/img/rutinas/fullbody.jpg',
    dias: {
      lunes: [
        { id: 1, nombre: 'Press de Banca Plano', grupoMuscular: 'Pecho', series: 3, repeticiones: '12', icono: '🏋️‍♂️', imagen: '/img/ejercicios/press-banca.svg', descanso: 75 },
        { id: 2, nombre: 'Sentadilla Trasera con Barra', grupoMuscular: 'Piernas', series: 3, repeticiones: '12', icono: '🦵', imagen: '/img/ejercicios/sentadilla.svg', descanso: 90 },
      ],
      miercoles: [
        { id: 3, nombre: 'Dominadas Pronadas', grupoMuscular: 'Espalda', series: 3, repeticiones: '10', icono: '🧗‍♂️', imagen: '/img/ejercicios/dominadas.svg', descanso: 75 },
        { id: 6, nombre: 'Plancha Abdominal', grupoMuscular: 'Core / Abdomen', series: 3, repeticiones: '45 seg', icono: '⏱️', imagen: '/img/ejercicios/plancha.svg', descanso: 45 },
      ],
      viernes: [
        { id: 4, nombre: 'Press Militar con Mancuernas', grupoMuscular: 'Hombros', series: 3, repeticiones: '12', icono: '💪', imagen: '/img/ejercicios/press-militar.svg', descanso: 60 },
        { id: 5, nombre: 'Peso Muerto Rumano', grupoMuscular: 'Piernas / Espalda Baja', series: 3, repeticiones: '12', icono: '⚡', imagen: '/img/ejercicios/peso-muerto.svg', descanso: 75 },
      ],
    },
  },
];

/**
 * Retorna la ruta a la imagen adecuada para una rutina.
 * Basado en nombre, objetivo o fallback deportivo.
 */
export function obtenerImagenRutina(rutina) {
  if (rutina?.imagen) return rutina.imagen;
  const nom = (rutina?.nombre || '').toLowerCase();
  const obj = (rutina?.objetivo || '').toLowerCase();
  if (nom.includes('push') || nom.includes('empuje')) return '/img/rutinas/push.jpg';
  if (nom.includes('pull') || nom.includes('tracci')) return '/img/rutinas/pull.jpg';
  if (nom.includes('pierna') || nom.includes('leg') || nom.includes('inferior')) return '/img/rutinas/piernas.jpg';
  if (nom.includes('fuerza') || obj.includes('fuerza')) return '/img/rutinas/fuerza.jpg';
  if (nom.includes('hipertrofia') || obj.includes('masa')) return '/img/rutinas/hipertrofia.jpg';
  if (nom.includes('full') || nom.includes('completo')) return '/img/rutinas/fullbody.jpg';
  return '/img/rutinas/banner-rutinas.jpg';
}

/**
 * Retorna la imagen vectorial deportiva para un ejercicio según su ID, nombre o grupo muscular.
 */
export function obtenerImagenEjercicio(ejercicio) {
  if (ejercicio?.imagen) return ejercicio.imagen;
  const nom = (ejercicio?.nombre || '').toLowerCase();
  const grupo = (ejercicio?.grupoMuscular || '').toLowerCase();

  if (nom.includes('banca') || grupo.includes('pecho')) return '/img/ejercicios/press-banca.svg';
  if (nom.includes('sentadilla') || grupo.includes('cuádricep') || (grupo.includes('pierna') && !grupo.includes('baja'))) return '/img/ejercicios/sentadilla.svg';
  if (nom.includes('dominada') || grupo.includes('dorsal') || (grupo.includes('espalda') && !grupo.includes('baja'))) return '/img/ejercicios/dominadas.svg';
  if (nom.includes('militar') || grupo.includes('hombro') || grupo.includes('deltoide')) return '/img/ejercicios/press-militar.svg';
  if (nom.includes('muerto') || grupo.includes('isquio') || grupo.includes('lumbar') || grupo.includes('baja')) return '/img/ejercicios/peso-muerto.svg';
  if (nom.includes('plancha') || grupo.includes('abdomen') || grupo.includes('core')) return '/img/ejercicios/plancha.svg';
  if (nom.includes('fondo') || grupo.includes('tríceps') || grupo.includes('triceps')) return '/img/ejercicios/fondos.svg';
  if (nom.includes('curl') || grupo.includes('bícep') || grupo.includes('biceps')) return '/img/ejercicios/curl-barra.svg';
  if (nom.includes('talon') || grupo.includes('pantorrilla') || grupo.includes('gemelo')) return '/img/ejercicios/gemelos.svg';

  return '/img/ejercicios/press-banca.svg';
}

export function obtenerRutinas() {
  const datos = localStorage.getItem(RUTINAS_KEY);
  if (!datos) {
    guardarRutinas(RUTINAS_INICIALES);
    return RUTINAS_INICIALES;
  }
  const lista = JSON.parse(datos);
  let cambio = false;
  const listaConImagenes = lista.map((r) => {
    if (!r.imagen) {
      cambio = true;
      return { ...r, imagen: obtenerImagenRutina(r) };
    }
    return r;
  });
  if (cambio) {
    guardarRutinas(listaConImagenes);
  }
  return listaConImagenes;
}

export function guardarRutinas(rutinas) {
  localStorage.setItem(RUTINAS_KEY, JSON.stringify(rutinas));
}

export function obtenerRutinaPorId(id) {
  const idNum = parseInt(id, 10);
  return obtenerRutinas().find((r) => r.id === idNum) || null;
}

export function agregarRutina(rutina) {
  const rutinas = obtenerRutinas();
  const nueva = {
    ...rutina,
    id: Date.now(),
    creadaEn: new Date().toISOString(),
    grupos: rutina.grupos || [],
    duracionMin: rutina.duracionMin || 45,
    nivel: rutina.nivel || 'Principiante',
    imagen: rutina.imagen || obtenerImagenRutina(rutina),
  };
  rutinas.push(nueva);
  guardarRutinas(rutinas);
  return nueva;
}

export function actualizarRutina(id, datos) {
  const rutinas = obtenerRutinas();
  const idx = rutinas.findIndex((r) => r.id === parseInt(id, 10));
  if (idx !== -1) {
    rutinas[idx] = { ...rutinas[idx], ...datos };
    guardarRutinas(rutinas);
    return rutinas[idx];
  }
  return null;
}

export function eliminarRutina(id) {
  const rutinas = obtenerRutinas().filter((r) => r.id !== id);
  guardarRutinas(rutinas);
}

// ─── ENTRENAMIENTOS ────────────────────────────────────────────────────────────

export function obtenerEntrenamientos() {
  const datos = localStorage.getItem(ENTRENAMIENTOS_KEY);
  return datos ? JSON.parse(datos) : [];
}

export function registrarEntrenamiento(rutinaId, rutinaNombre, duracionMinutos = 45, caloriasEstimadas = 0) {
  const entrenamientos = obtenerEntrenamientos();
  const hoy = new Date().toDateString();
  const yaRegistrado = entrenamientos.some(
    (e) => e.rutinaId === rutinaId && new Date(e.fecha).toDateString() === hoy
  );
  if (yaRegistrado) return null;

  const nuevo = {
    id: Date.now(),
    rutinaId,
    rutinaNombre,
    duracionMinutos: Number(duracionMinutos),
    caloriasEstimadas: caloriasEstimadas || Math.round(duracionMinutos * 6.5),
    fecha: new Date().toISOString(),
  };
  entrenamientos.push(nuevo);
  localStorage.setItem(ENTRENAMIENTOS_KEY, JSON.stringify(entrenamientos));
  return nuevo;
}

// ─── ESTADÍSTICAS ──────────────────────────────────────────────────────────────

export function calcularEstadisticas() {
  const rutinas = obtenerRutinas();
  const entrenamientos = obtenerEntrenamientos();
  const ahora = new Date();

  const inicioDeSemana = new Date(ahora);
  inicioDeSemana.setDate(ahora.getDate() - ahora.getDay());
  inicioDeSemana.setHours(0, 0, 0, 0);

  const inicioDelMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const estaSemana = entrenamientos.filter((e) => new Date(e.fecha) >= inicioDeSemana);
  const esteMes = entrenamientos.filter((e) => new Date(e.fecha) >= inicioDelMes);

  const duracionTotal = entrenamientos.reduce((acc, e) => acc + (e.duracionMinutos || 0), 0);
  const caloriasTotal = entrenamientos.reduce((acc, e) => acc + (e.caloriasEstimadas || 0), 0);
  const duracionPromedio = entrenamientos.length > 0 ? Math.round(duracionTotal / entrenamientos.length) : 45;

  return {
    totalRutinas: rutinas.length,
    entrenamientosSemanales: estaSemana.length,
    duracionPromedio,
    totalEntrenamientos: entrenamientos.length,
    entrenamientosEsteMes: esteMes.length,
    duracionTotal,
    caloriasTotal,
  };
}

/** Entrenamientos de los últimos N meses agrupados por semana */
export function obtenerEntrenamientosPorPeriodo(meses = 1) {
  const entrenamientos = obtenerEntrenamientos();
  const ahora = new Date();
  const inicio = new Date(ahora);
  inicio.setMonth(inicio.getMonth() - meses);
  inicio.setHours(0, 0, 0, 0);

  // Agrupar por semana dentro del período
  const semanas = [];
  const totalSemanas = meses * 4;

  for (let i = totalSemanas - 1; i >= 0; i--) {
    const inicioSem = new Date(ahora);
    inicioSem.setDate(ahora.getDate() - ahora.getDay() - i * 7);
    inicioSem.setHours(0, 0, 0, 0);
    const finSem = new Date(inicioSem);
    finSem.setDate(inicioSem.getDate() + 6);
    finSem.setHours(23, 59, 59, 999);

    if (inicioSem < inicio) continue;

    const cantidad = entrenamientos.filter((e) => {
      const f = new Date(e.fecha);
      return f >= inicioSem && f <= finSem;
    }).length;

    // Label más corto dependiendo del período
    const label = meses <= 1
      ? `S${totalSemanas - i}`
      : `${inicioSem.getDate()}/${inicioSem.getMonth() + 1}`;

    semanas.push({ label, cantidad });
  }

  return semanas;
}

/** Calcula la racha actual de días consecutivos con entrenamiento */
export function calcularRachaActual() {
  const entrenamientos = obtenerEntrenamientos();
  if (entrenamientos.length === 0) return 0;

  // Obtener fechas únicas (un entrenamiento por día) ordenadas desc
  const fechasUnicas = [...new Set(
    entrenamientos.map((e) => new Date(e.fecha).toDateString())
  )].map((d) => new Date(d)).sort((a, b) => b - a);

  if (fechasUnicas.length === 0) return 0;

  let racha = 0;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < fechasUnicas.length; i++) {
    const esperado = new Date(hoy);
    esperado.setDate(hoy.getDate() - i);
    esperado.setHours(0, 0, 0, 0);

    const fechaCheck = new Date(fechasUnicas[i]);
    fechaCheck.setHours(0, 0, 0, 0);

    if (fechaCheck.getTime() === esperado.getTime()) {
      racha++;
    } else {
      break;
    }
  }
  return racha;
}

/** Genera los logros desbloqueados en base al historial */
export function calcularLogros() {
  const entrenamientos = obtenerEntrenamientos();
  const racha = calcularRachaActual();
  const total = entrenamientos.length;
  const duracionTotal = entrenamientos.reduce((s, e) => s + (e.duracionMinutos || 0), 0);

  const logros = [
    {
      id: 'primer-entreno',
      nombre: 'Primer Entrenamiento',
      descripcion: 'Completaste tu primera sesión de entrenamiento.',
      emoji: '🏅',
      imagen: '/img/progreso/logro-primer-entreno.svg',
      desbloqueado: total >= 1,
    },
    {
      id: 'racha-3',
      nombre: 'Racha de 3 días',
      descripcion: 'Entrenaste 3 días consecutivos.',
      emoji: '🔥',
      imagen: '/img/progreso/logro-racha-3.svg',
      desbloqueado: racha >= 3,
    },
    {
      id: 'cinco-sesiones',
      nombre: '5 Sesiones',
      descripcion: 'Acumulaste 5 sesiones de entrenamiento.',
      emoji: '⭐',
      imagen: '/img/progreso/logro-cinco-sesiones.svg',
      desbloqueado: total >= 5,
    },
    {
      id: 'hora-total',
      nombre: 'Primera Hora',
      descripcion: 'Acumulaste 60 minutos de entrenamiento en total.',
      emoji: '⏱️',
      imagen: '/img/progreso/logro-hora.svg',
      desbloqueado: duracionTotal >= 60,
    },
    {
      id: 'diez-sesiones',
      nombre: '10 Sesiones',
      descripcion: 'Completaste 10 sesiones. ¡Vas por buen camino!',
      emoji: '🏆',
      imagen: '/img/progreso/logro-diez-sesiones.svg',
      desbloqueado: total >= 10,
    },
    {
      id: 'racha-7',
      nombre: 'Semana Perfecta',
      descripcion: 'Entrenaste 7 días seguidos.',
      emoji: '💎',
      imagen: '/img/progreso/logro-semana-perfecta.svg',
      desbloqueado: racha >= 7,
    },
  ];
  return logros;
}
