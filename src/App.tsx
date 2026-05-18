import { Routes, Route } from 'react-router-dom';
import  Login   from './pages/Login';
import Dashboard from './pages/Dashboard';

//import { DiVim } from 'react-icons/di';


function App() {
  return (

    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
    </Routes>
   
  );
}

export default App;
