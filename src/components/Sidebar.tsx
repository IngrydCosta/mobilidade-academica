import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineLogin } from "react-icons/ai";
import { GoTrophy } from "react-icons/go";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.perfil === "ADMINISTRADOR";
  const canManage = user?.perfil === "ADMINISTRADOR" || user?.perfil === "GESTOR_MOBILIDADE";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'bg-[#D9A95E] text-[#0C2445] font-semibold rounded-md p-2.5 px-4 cursor-pointer flex items-center gap-3 transition-colors'
      : 'text-white hover:bg-white/10 hover:text-white rounded-md p-2.5 px-4 cursor-pointer flex items-center gap-3 transition-colors';
  };

  const getIconClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `h-5 w-5 md:h-6 md:w-6 shrink-0 ${isActive ? 'text-[#0C2445]' : 'text-[#FFFFFF]'}`;
  };

  return (
    <aside className='sticky top-0 h-screen w-64 shrink-0 bg-[#173764] text-[#FFFFFF] flex flex-col border-r border-white/10 overflow-y-auto'>
      <div className='p-6 flex items-center gap-3 border-b border-white/5'>
        <div className='bg-orange-200 p-1.5 rounded-md text-[#002147] text-sm'></div>
        <div>
          <h1 className='font-bold text-sm leading-tight'>Mobilidade Acadêmica</h1>
          <p className='text-[10px] opacity-60 uppercase tracking-wider'>Mobility Dashboard</p>
        </div>
      </div>

      <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
        <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
          <MdDashboard className={getIconClasses("/dashboard")}/>
          <span>Dashboard</span>
        </Link>
        <Link to="/rankings" className={getLinkClasses("/rankings")}>
          <GoTrophy className={getIconClasses("/rankings")}/>
          <span>Rankings</span>
        </Link>
        {canManage && (
          <Link to="/registarMobilidade" className={getLinkClasses("/registarMobilidade")}>
            <IoAddCircleOutline className={getIconClasses("/registarMobilidade")}/>
            <span>Registar Mobilidade</span>
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
          <h3 className='font-light text-[#728297] text-xs px-2 pt-1 uppercase tracking-wider'>GESTÃO</h3>
          <Link to="/cadastroUtilizador" className={getLinkClasses("/cadastroUtilizador")}>
            <LuUsers className={getIconClasses("/cadastroUtilizador")} />
            <span>Utilizadores</span>
          </Link>
          <Link to="/cadastroUniversidade" className={getLinkClasses("/cadastroUniversidade")}>
            <LiaUniversitySolid className={getIconClasses("/cadastroUniversidade")}/>
            <span>Universidades</span>
          </Link>
        </div>
      )}

      <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
        <h3 className='font-light text-[#728297] text-xs px-2 pt-1 uppercase tracking-wider'>DOCUMENTAÇÃO</h3>
        <Link to="/introducao" className={getLinkClasses("/introducao")}>
          <IoBookOutline className={getIconClasses("/introducao")} />
          <span>Introdução</span>
        </Link>
      </div>

      <div className='flex flex-col p-3 mt-auto border-t border-white/5'>
        <button
          onClick={handleLogout}
          className='p-2.5 px-4 rounded-md cursor-pointer flex items-center gap-3 text-white hover:bg-white/10 hover:text-orange-200 transition-colors w-full text-left bg-transparent border-none'
        >
          <AiOutlineLogin className='h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF] shrink-0'/>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;