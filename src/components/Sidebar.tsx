import {Link} from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineLogin } from "react-icons/ai";
import { GoTrophy } from "react-icons/go";

 function Sidebar(){
    
    return(
        <aside className=' left-0 top-0 w-64 min-h-screen bg-[#173764] text-[#FFFFFF] flex flex-col border-r border-white/10'>
            <div className='p-6 flex items-center gap-3 border-b border-white/5'>
            <div className='bg-orange-200 p-1.5 rounded-md text-[#002147] text-sm'></div>
            <div>
                <h1 className='font-bold text-sm leading-tight'>Mobilidade Acadêmica</h1>
                <p className='text-[10px] opacity-60 uppercase tracking-wider'>Mobility Dashboard</p>
            </div>
             </div>

             <div className='flex flex-col p-2.5 gap-3 border-b border-white/5 w-64'>
            
                <Link to="/dashboard" className='bg-[#D9A95E] text-[#0C2445] rounded-md p-1.5 px-10 cursor-pointer flex items-center gap-2'><MdDashboard className='h-5 w-5 md:h-6 md:w-6 text-[#0C2445]'/><span>Dashboard</span></Link>
                <Link to="/rankings" className='p-2.5 cursor-pointer px-10 flex items-center gap-2'> <GoTrophy className='h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF] shrink-0'/><span>Rankings</span></Link>
                <Link to="/registarMobilidade" className='p-2.5 cursor-pointer px-10 flex items-center gap-2 whitespace-nowrap'><IoAddCircleOutline className="h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF] shrink-0"/><span>Registar Mobilidade</span></Link>
        
            </div>
            <div className='flex flex-col p-2.5 items-start gap-3 border-b border-white/5 w-64'>
                <h3 className='font-light text-[#728297] text-xs p-1.5 px-05'>GESTÃO</h3>
                <Link to="/cadastroUtilizador" className='p-2.5 cursor-pointer px-10 flex items-center gap-2'> <LuUsers className="h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF]" /><span>Utilizadores</span></Link>
                <Link to="/cadastroUniversidade" className='p-2.5 cursor-pointer px-10 flex items-center gap-2'><LiaUniversitySolid className="h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF]"/><span>Universidades</span></Link>
            </div>
            <div className='flex flex-col p-2.5 items-start gap-3 border-b border-white/5 w-64'>
                <h3 className='font-light text-[#728297] text-xs p-1.5 px-05'>DOCUMENTAÇÃO</h3>
                <Link to="/introducao" className='p-2.5 cursor-pointer px-10 flex items-center gap-2'><IoBookOutline className="h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF]" /><span>Introdução</span></Link>
            </div>
            <div className=' flex flex-col p-2.5 gap-3 mt-auto'>
                    <Link to="/login" className='p-2.5 cursor-pointer px-10 flex flex-row items-center gap-2.5 text-lg'><AiOutlineLogin className='h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF]'/><span>Sair</span></Link>
            </div>
        </aside>
    );
}

export default Sidebar;


         