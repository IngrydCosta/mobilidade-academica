import { Routes, Route } from 'react-router-dom';
import  Login   from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardInterno from './pages/DashboardInterno';
import CadastroMobilidade from './pages/CadastroMobilidade';
import CadastroUtilizador from './pages/CadastroUtilizador';
import CadastroUniversidades from './pages/CadastroUniversidades';
import Introducao from './pages/Introducao';
import Rankings from './pages/Rankings'




function App() {
  return (

    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<DashboardInterno />} />
      <Route path='/registarMobilidade' element={<CadastroMobilidade />} />
      <Route path='/cadastroUtilizador' element={<CadastroUtilizador />} />
      <Route path='/university' element={<CadastroUniversidades />} />
      <Route path='/introducao' element={<Introducao />} />
      <Route path='/rankings' element={<Rankings />} />
    </Routes>
   
  );
}

export default App;
