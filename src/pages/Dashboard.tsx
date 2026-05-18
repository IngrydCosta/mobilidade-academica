import Navbar from "../components/Navbar";
import { PiStudentFill } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import { RiUserReceived2Line } from "react-icons/ri";
import { PiMedal } from "react-icons/pi";
import Grafico from '../components/Grafico'
import { TbWorldPin } from "react-icons/tb";
import { TbWorldCheck } from "react-icons/tb";
import { MdOutlineSchool } from "react-icons/md";


function Dashboard() {

    return (
        <div className="flex flex-col gap-10">
            <Navbar />

            <div>
                <div className=" text-[#0E284E]">
                    <h1 className="font-medium text-5xl p-2 ml-2">Dashboard de Mobilidade</h1>
                    <h2 className="font-light p-2 ml-3 text-[#404c4e]">Dados públicos consolidados - Visitante</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]">TOTAL DE MOBILIDADES</span>
                            <span className="text-[#0E284E] font-bold text-2xl">3156</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"><PiStudentFill className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]">ESTUDANTES ENVIADOS</span>
                            <span className="text-[#0E284E] font-bold text-2xl">1680</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"> <FiSend className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]">ESTUDANTES RECEBIDOS</span>
                            <span className="text-[#0E284E] font-bold text-2xl">1476</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"> <RiUserReceived2Line className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 mr-4 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]">ANO COM MAIOR MOBILIDADE</span>
                            <span className="text-[#0E284E] font-bold text-2xl">2024</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"><PiMedal className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                </div>
            </div>


            <div className="bg-[#FFFFFF] shadow-lg p-5 ml-5 mr-5 rounded-lg">
                <span className="text-[#0E284E] font-medium text-3xl">Tendência de Mobilidade por Ano</span>
                <Grafico />
            </div>

            <div className="bg-linear-to-br from-[#0E284E]  to-[#17498b] text-[#d4d3ce] ml-5 mr-5 mb-4 rounded-lg p-3">

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><TbWorldCheck /><span>MÉDIA DE MOBILIDADE/ANO</span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">631</span>
                </div>

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><MdOutlineSchool /> <span>UNIVERSIDADES PARTICIPANTES</span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">6</span>
                </div>

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><TbWorldPin />  <span>PAÍSES ENVOLVIDOS</span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">5</span>
                </div>

            </div>
        </div>

    )
}


export default Dashboard;