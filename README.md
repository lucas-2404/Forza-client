# ⚡ FORZA – Frontend

Aplicación web para planificar, crear, organizar y gestionar rutinas de entrenamiento de gimnasio.

---

## 🛠️ 1. Tecnologías Utilizadas

Este proyecto utiliza las siguientes tecnologías requeridas por la cátedra:

- **React (v18)**: Biblioteca principal para la creación de interfaces de usuario declarativas mediante componentes.
- **Vite (v6)**: Herramienta de compilación ultrarrápida para desarrollo moderno.
- **JavaScript (ES6+)**: Lenguaje estándar de desarrollo sin tipado estático adicional.
- **Bootstrap (v5.3)**: Framework CSS para maquetación, sistema de grillas responsivas y diseño adaptable.
- **React Bootstrap (v2.10)**: Componentes nativos de React (`Container`, `Row`, `Col`, `Navbar`, `Nav`, `Button`, `Card`, `Form`, `Modal`, `Alert`, `Dropdown`, `Spinner`, `Offcanvas`, `Badge`, `ProgressBar`).
- **CSS Personalizado (`global.css`)**: Estilos propios para la identidad visual de FORZA (fondo oscuro, verde lima, bordes redondeados, sombras y efectos hover).
- **React Router DOM (v6)**: Enrutador del lado del cliente (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`, `Link`).
- **Axios**: Cliente HTTP preparado para conectar con el backend.
- **SweetAlert2**: Notificaciones emergentes y alertas interactivas modernas.
- **Framer Motion**: Animaciones sutiles y transiciones fluidas de componentes.

*(No se utiliza Tailwind CSS ni TypeScript).*

---

## 📁 2. Estructura del Proyecto

```text
forza-frontend/
│
├── public/
│   └── img/                    # Imágenes estáticas y recursos públicos
│
├── src/
│   ├── assets/                 # Recursos gráficos importables
│   │
│   ├── components/             # Componentes reutilizables de la interfaz
│   │   ├── layout/             # Componentes del Diseño B (Sidebar + Topbar + Footer)
│   │   │   ├── Sidebar.jsx     # Barra lateral fija con logo FORZA, links de navegación y perfil
│   │   │   ├── Topbar.jsx      # Barra superior con buscador visual, notificaciones y avatar
│   │   │   ├── NavigationItems.jsx # Lista modular de enlaces de navegación (NavLink)
│   │   │   ├── Icons.jsx       # Iconos SVG nativos (mancuerna, casa, calendario, etc.)
│   │   │   ├── Footer.jsx      # Pie de página sobrio integrado al pie del área principal
│   │   │   ├── Layout.jsx      # Envoltorio del Diseño B (Sidebar + Topbar + Outlet + Offcanvas)
│   │   │   ├── Navbar.jsx      # Componente Navbar previo conservado por compatibilidad
│   │   │   └── layout.css      # Estilos dedicados del Sidebar, Topbar y menú responsive
│   │   │
│   │   ├── ejercicios/         # Componentes dedicados al catálogo de ejercicios (Módulo 2)
│   │   ├── rutinas/            # Componentes dedicados a la gestión de rutinas (Módulo 1)
│   │   └── usuarios/           # Componentes dedicados a login, registro y perfil (Módulos 3 y 4)
│   │
│   ├── pages/                  # Vistas completas adaptadas con React Bootstrap
│   │   ├── HomePage.jsx        # Portada, Hero animado, Alert, Modal, Cards y SweetAlert2
│   │   ├── LoginPage.jsx       # Formulario de login (Form.Group, Form.Control, Button)
│   │   ├── RegisterPage.jsx    # Formulario de registro (Form.Group, Form.Control, Button)
│   │   ├── DashboardPage.jsx   # Métricas y estadísticas (Card, Badge, ProgressBar)
│   │   ├── EjerciciosPage.jsx  # Catálogo con filtro interactivo (Card, Badge, Dropdown)
│   │   ├── RutinaPage.jsx      # Lista de rutinas y guía lateral (Card, Badge, Offcanvas)
│   │   ├── PerfilPage.jsx      # Datos personales y simulación de guardado con Spinner
│   │   └── NotFoundPage.jsx    # Pantalla 404 centrada (Container, Row, Col, Button)
│   │
│   ├── router/
│   │   └── Rutas.jsx           # Configuración central de rutas con React Router
│   │
│   ├── services/
│   │   └── api.js              # Instancia configurada de Axios para llamadas a la API
│   │
│   ├── data/
│   │   └── ejercicios.js       # Datos de muestra de ejercicios (mock data)
│   │
│   ├── styles/
│   │   └── global.css          # Estilos personalizados FORZA (tema oscuro y verde lima)
│   │
│   ├── App.jsx                 # Componente raíz envuelto en BrowserRouter
│   └── main.jsx                # Entrada al DOM con importación de Bootstrap + global.css
│
├── .env.example                # Plantilla de variables de entorno (VITE_API_URL)
├── .gitignore                  # Archivos ignorados por Git (.env, node_modules, etc.)
├── index.html                  # HTML principal con título "FORZA"
├── package.json                # Dependencias instaladas
├── vite.config.js              # Configuración de Vite con soporte para React
└── README.md                   # Documentación oficial del proyecto
```

---

## 👥 3. Distribución de Trabajo para los 4 Integrantes

| Integrante | Módulo Asignado | Carpetas y Componentes Clave |
| :--- | :--- | :--- |
| **Integrante 1** | **Gestión de Rutinas** | `src/pages/RutinaPage.jsx`<br>`src/components/rutinas/` (Card, Badge, Button, Offcanvas, Modal) |
| **Integrante 2** | **Catálogo de Ejercicios** | `src/pages/EjerciciosPage.jsx`<br>`src/components/ejercicios/`<br>`src/data/ejercicios.js` (Card, Dropdown, Badge) |
| **Integrante 3** | **Autenticación (Login / Registro)** | `src/pages/LoginPage.jsx`<br>`src/pages/RegisterPage.jsx`<br>`src/components/usuarios/` (Form, Form.Control, Button) |
| **Integrante 4** | **Dashboard y Perfil de Usuario** | `src/pages/DashboardPage.jsx`<br>`src/pages/PerfilPage.jsx`<br>`src/components/usuarios/` (Card, ProgressBar, Spinner) |

---

## 🚀 4. Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```

3. **Ejecutar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🎨 5. Identidad Visual

- **Estructura y Responsive**: Gestionado a través del sistema de grillas de **Bootstrap** (`Container`, `Row`, `Col`).
- **Paleta de Colores**: Fondo negro y gris grafito (`#0c0d10`, `#14161c`, `#1b1e26`) con acentos vibrantes en verde lima deportivo (`#ccff00`).
- **Componentes**: Tarjetas con bordes redondeados (`14px`), sombras y efectos hover sutiles.
