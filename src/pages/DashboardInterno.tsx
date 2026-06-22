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
import { useEffect, useState } from "react";
import axios from "axios";
import Table, { type Column } from "../components/Table";


type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
  total: number;
};


type DashboardData = {
  cards: {
    total: number;
    enviados: number;
    recebidos: number;
    anoTop: number;
  };
  grafico: Array<{
    ano: string;
    enviados: number;
    recebidos: number;
  }>;
  table: Array<{
    universidade: string;
    pais: string;
    ano: number;
    enviados: number;
    recebidos: number;
    total: number;
  }>;
};



function DashboardInterno() {

const[universityFilter, setUniversityFilter] = useState("")
const[yearFilter, setYearFilter] = useState("")
const[countryFilter, setCountryFilter] = useState("");
const [dashboard, setDashboard] = useState<DashboardData | null>(null);

useEffect(() => {
    const token = localStorage.getItem("token");

    
  
      async function findDashboard() {
       try{
        const resposta = await axios.get("http://localhost:3333/dashboard/private", {
          headers: {Authorization: `Bearer ${token}` },
            params: {
              university: universityFilter || undefined,
              country: countryFilter || undefined,
              year: yearFilter ? Number(yearFilter) : undefined,
            },
        });
        

        setDashboard(resposta.data); 
    } catch (error) {
      console.error("Erro ao buscar dashboard", error);
    }
  }
      findDashboard();
    }, [universityFilter, countryFilter, yearFilter]);

    
   
const columns: Column<MobilityData>[] = [
  {
    header: "UNIVERSIDADE",
    accessor: "universidade",
  },
  {
    header: "PAÍS",
    accessor: "pais",
  },
  {
    header: "ANO",
    accessor: "ano",
  },
  {
    header: "ENVIADOS",
    accessor: "enviados",
  },
  {
    header: "RECEBIDOS",
    accessor: "recebidos",
  },
  {
    header: "TOTAL",
    accessor:"total"
  }
];


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
                             <Card title="TOTAL DE MOBILIDADES" icon={<PiStudentFill className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]"/>} number={dashboard?.cards.total ?? 0} />
                             <Card title="ESTUDANTES ENVIADOS" icon={<FiSend className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.enviados ?? 0}/>
                             <Card title="ESTUDANTES RECEBIDOS" icon={<RiUserReceived2Line className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.recebidos ?? 0}/>
                             <Card title="ANO COM MAIOR MOBILIDADE" icon={<PiMedal className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.anoTop ?? 0}/> 
                           </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl">
           <div>
               <Title title="Tendência de Mobilidade por Ano" size="text-2xl" className="mb-0 bg-[#FFFFFF]"/>
                <GraficoRow dashboardData={dashboard} />
            </div>
        </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl bg-[#FFFFFF]">
             <div>
                <Title title="Comparação Anual" size="text-2xl" className="mb-0"/>
                <GraficoCol dashboardData={dashboard}/>
            </div>
        </section>

        <section className="flex flex-col border border-gray-300 rounded-lg shadow-2xl bg-[#FFFFFF]">
          <div>
            <Title title="Registos de Mobilidade" size="text-2xl" className="mb-0" />
            <Table columns={columns} data={dashboard?.table || []}/>
          </div>
        </section>

      </main>
    </div>
  )
}

export default DashboardInterno
