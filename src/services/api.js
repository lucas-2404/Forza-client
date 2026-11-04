import axios from 'axios';

/**
 * Instancia configurada de Axios para el proyecto FORZA.
 * Utiliza la URL del backend definida en el archivo .env (VITE_API_URL).
 * Si no está definida, utiliza un valor por defecto para desarrollo local.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Tiempo límite de espera de 10 segundos
});

// Interceptor para agregar token si en el futuro se implementa autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forza_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

