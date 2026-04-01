import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Cursos from './pages/Cursos';
import Alumnos from './pages/Alumnos';
import Asistencia from './pages/Asistencia';
import Reportes from './pages/Reportes';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Cursos />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}