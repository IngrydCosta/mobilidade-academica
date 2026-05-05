//import {Link} from 'react-router-dom';

export default function Sidebar(){
    return(
        <aside className='w-64 h-screen bg-[#173764] text-white flez flex-col fixed left-0 top-0 border-r border-write/10'>
            <div className='p-6 flex items-center gap-3 border-b border-white/5'>
            <div className='bg-orange-200 p-1.5 rounded-md text-[#002147] text-sm'></div>
            <div>
                <h1 className='font-bold text-sm leading-tight'>Mobilidade</h1>
                <p className='text-[10px] opacity-60 uppercase tracking-wider'>Dashboard</p>
            </div>
             </div>
        </aside>
    );
}
