import Card from "../components/Card";
import CountryFilter from "../components/filters/CountryFilter";
import UniversityFilter from "../components/filters/UniversityFilter";
import YearFilter from "../components/filters/YearFilter";
import Sidebar from "../components/Sidebar";
import Title from "../components/ui/Title";
import { PiMedal, PiStudentFill } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import { RiUserReceived2Line } from "react-icons/ri";
import GraficoRow from "../components/GraficoRow";
import GraficoCol from "../components/GraficoCol";
import Table, { type Column } from "../components/Table";
import { useState } from "react";




const columns: Column<MobilityData>[] = [
  {
    header: "UNIVERSIDADE",
    accessor: "universidade",
    className:"text-[#0E284E] font-bold",
  },

  {
    header: "PAÍS",
    accessor: "pais",
    className:"text-[#404c4e]",
  },

  {
    header: "ANO",
    accessor: "ano",
    className:"text-[#404c4e]",
  },

  {
    header: "ENVIADOS",
    accessor: "enviados",
    className:"text-[#0E284E] font-bold"
  },

  {
    header: "RECEBIDOS",
    accessor: "recebidos",
    className:"text-[#D4A969] font-bold"
  },

  {
    header: "TOTAL",
    accessor: "total",
    className:"text-[#404c4e] font-bold"
  },
];

const mobilityData = [
  {
    universidade: "Universidade de Lisboa",
    pais: "Portugal",
    ano: 2020,
    enviados: 50,
    recebidos: 29,
    total: 79,
  },

  {
    universidade: "Universidade de Coimbra",
    pais: "Portugal",
    ano: 2024,
    enviados: 64,
    recebidos: 61,
    total: 125,
  },

  {
    universidade: "Sorbonne Université",
    pais: "França",
    ano: 2023,
    enviados: 64,
    recebidos: 62,
    total: 126,
  },
];

type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
  total: number;
};

function DashboardInterno() {

const[universityFilter, setUniversityFilter] = useState("")
const[yearFilter, setYearFilter] = useState("")
const[countryFilter, setCountryFilter] = useState("")

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      
        <main className="flex-1 px-4 md:px-10 py-4">
        <Title title="Dashboard de Mobilidade" subtitle="Visão geral da mobilidade estudantil"/>
        <section className="p-6  bg-[#FFFFFF] border border-gray-300 rounded-lg">
          <h1 className="text-[#0E284E] text-2xl font-medium flex flex-col md:flex-row gap-4 items-end">Filtros</h1>

          <div className="flex flex-col md:flex-row gap-4 items-end">
        <UniversityFilter value={universityFilter} onChange={setUniversityFilter}/>
        <CountryFilter value={countryFilter} onChange={setCountryFilter} />
        <YearFilter value={yearFilter} onChange={setYearFilter} />
          </div>
        
        </section>
       <section className=" grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="TOTAL DE MOBILIDADES" icon={<PiStudentFill className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]"/>} number={3156} />
          <Card title="ESTUDANTES ENVIADOS" icon={<FiSend className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={1680}/>
          <Card title="ESTUDANTES RECEBIDOS" icon={<RiUserReceived2Line className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={1476}/>
          <Card title="ANO COM MAIOR MOBILIDADE" icon={<PiMedal className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={2024}/> 
        </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl">
           <div>
               <Title title="Tendência de Mobilidade por Ano" size="text-2xl" className="mb-0 bg-[#FFFFFF]"/>
                <GraficoRow />
            </div>
        </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl bg-[#FFFFFF]">
             <div>
                <Title title="Comparação Anual" size="text-2xl" className="mb-0"/>
                <GraficoCol />
            </div>
        </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl bg-[#FFFFFF]">
          <div>
            <Title title="Registos de Mobilidade" size="text-2xl" className="mb-0" />
            <Table columns={columns} data={mobilityData}/>
          </div>
        </section>

      </main>
    </div>
  )
}

export default DashboardInterno
