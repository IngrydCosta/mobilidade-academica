import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardInterno from './pages/DashboardInterno';
import CadastroMobilidade from './pages/CadastroMobilidade';
import CadastroUtilizador from './pages/CadastroUtilizador';
import CadastroUniversidades from './pages/CadastroUniversidades';
import Introducao from './pages/Introducao';
import Rankings from './pages/Rankings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/introducao' element={<Introducao />} />
      <Route path='/rankings' element={<Rankings />} />

      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashboardInterno />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ADMINISTRADOR', 'GESTOR_MOBILIDADE']} />}>
        <Route path='/registarMobilidade' element={<CadastroMobilidade />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ADMINISTRADOR']} />}>
        <Route path='/cadastroUtilizador' element={<CadastroUtilizador />} />
        <Route path='/cadastroUniversidade' element={<CadastroUniversidades />} />
      </Route>
    </Routes>
  );
}

export default App;
