
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DumbbellIcon,
  CalendarIcon,
  ChartIcon,
  HeartIcon,
  AppleIcon,
} from './Icons';

// Enlaces principales del Sidebar
export const mainNavLinks = [
  { name: 'Inicio', path: '/', icon: HomeIcon, end: true },
  { name: 'Ejercicios', path: '/ejercicios', icon: DumbbellIcon },
  { name: 'Rutinas', path: '/rutinas', icon: CalendarIcon },
  { name: 'Progreso', path: '/dashboard', icon: ChartIcon },
  { name: 'Favoritos', path: '/favoritos', icon: HeartIcon },
  { name: 'Alimentación', path: '/alimentacion', icon: AppleIcon },
];

// Clases Bootstrap reutilizadas para los enlaces
const clasesEnlace =
  'sidebar-link d-flex align-items-center gap-3 p-2 px-3 rounded-3 text-decoration-none w-100';

function NavigationItems({ onItemClick }) {

  // Cerrar el menú lateral en dispositivos móviles
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // Aplicar la clase active cuando estamos en la ruta
  const obtenerClaseEnlace = ({ isActive }) =>
    isActive ? `${clasesEnlace} active` : clasesEnlace;

  return (
    <div className="d-flex flex-column flex-grow-1 p-3">

      {/* Navegación principal */}
      <nav aria-label="Navegación principal">

        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">

          {mainNavLinks.map((item) => {
            const IconComponent = item.icon;

            return (
              <li key={item.path} className="w-100">

                <NavLink
                  to={item.path}
                  end={item.end}
                  className={obtenerClaseEnlace}
                  onClick={handleClick}
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <IconComponent size={20} />
                  </span>

                  <span className="flex-grow-1">
                    {item.name}
                  </span>

                </NavLink>

              </li>
            );
          })}

        </ul>

      </nav>

    </div>
  );
}

export default NavigationItems;
