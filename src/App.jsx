import { BrowserRouter } from 'react-router-dom';
import Rutas from './router/Rutas';

/**
 * Componente principal de la aplicación FORZA.
 * Envuelve el enrutador general dentro de BrowserRouter.
 */
function App() {
  return (
    <BrowserRouter>
      <Rutas />
    </BrowserRouter>
  );
}

export default App;

