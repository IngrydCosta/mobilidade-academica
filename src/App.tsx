import { Routes, Route } from 'react-router-dom';
import  Login   from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardInterno from './pages/DashboardInterno';
import CadastroMobilidade from './pages/CadastroMobilidade';
import CadastroUtilizador from './pages/CadastroUtilizador';
import CadastroUniversidades from './pages/CadastroUniversidades';
import Introducao from './pages/Introducao';

//import { DiVim } from 'react-icons/di';


function App() {
  return (

    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<DashboardInterno />} />
      <Route path='/registarMobilidade' element={<CadastroMobilidade />} />
      <Route path='/cadastroUtilizador' element={<CadastroUtilizador />} />
      <Route path='/cadastroUniversidade' element={<CadastroUniversidades />} />
      <Route path='/introducao' element={<Introducao />} />
    </Routes>
   
  );
}

export default App;
