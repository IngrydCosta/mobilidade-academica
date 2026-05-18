import { IoSchoolOutline } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoLanguageOutline } from "react-icons/io5";



function Navbar() {
  return (
   
        <nav className=" flex flex-row w-screen h-25 items-center gap-2 bg-[#173764] text-[#d4d3ce] justify-between">
           
           <div className="flex flex-row gap-2">
                <div className="bg-[#E1B56F] rounded-md p-4 ml-5">
                    <IoSchoolOutline className="text-[#0E284E] h-7 w-7 md:h-8 md:w-8" />
                </div>
            <div>
                <p className="font-medium text-2xl">Mobilidade Académica</p>
                <p className="font-light">DASHBOARD PÚBLICO</p>
            </div>      
           </div>
           
            <div className=" flex flex-row gap-2 items-center">
                <div>
                    <button className="bg-[#FAFCFD] rounded-md px-6 py-2 flex flex-row items-center gap-2"><IoLanguageOutline className="text-[#404c4e]"/>
                       <span className="text-[#000000]">PT/EN</span> 
                    </button>
                </div>
                <div>
                    <button className="bg-[#E1B56F] rounded-md px-6 py-2 cursor-pointer text-[#0E284E] font-medium flex items-center gap-2 mr-4"><span>Entrar</span><IoIosArrowRoundForward className="text-[#0E284E] h-4 w-4 md:h-5 md:w-5" /></button>
                </div>
            </div>
        </nav>
 
  )
}

export default Navbar