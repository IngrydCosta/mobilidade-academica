import { useEffect, useState } from "react";
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Table, { type Column } from "../components/Table";
import axios from "axios";



type UniversityRanking = {
  universidade: string;
  pais: string;
  total: number;
};

type CountryRanking = {
  
  pais: string;
  total: number;
  };
  

function Rankings() {

    const [yearFilter, setYearFilter] = useState("2026");
    const [universityRanking, setUniversityRanking] = useState<UniversityRanking[]>([]);
    const [countryRanking, setCountryRanking] = useState<CountryRanking[]>([]);

    const columnsUniversity: Column<UniversityRanking>[] = [
    { header: "UNIVERSIDADE", accessor: "universidade" },
    { header: "PAÍS", accessor: "pais" },
    { header: "TOTAL DE MOBILIDADES", accessor: "total" },
  ];

  const columnsCountry: Column<CountryRanking>[] = [
    { header: "PAÍS", accessor: "pais" },
    { header: "TOTAL DE MOBILIDADES", accessor: "total" },
  ];
  
  


useEffect(() => {
    const token = localStorage.getItem("token");

    
  
      async function findRanking() {
       try{
        const resposta = await axios.get("http://localhost:3333/ranking", {
          headers: {Authorization: `Bearer ${token}` },
          params: { year: yearFilter },
        });
    
        setUniversityRanking(resposta.data.universityRanking || []); 
        setCountryRanking(resposta.data.countryRanking || []);
    } catch (error) {
      console.error("Erro ao buscar ranking", error);
    }
    
  }
      findRanking();
    }, [yearFilter]);

    
  return (
    <div className="flex min-h-screen ">
        <Sidebar />

        <main className="flex flex-col gap-4 p-4">
        <Title  title="Ranking do Estudante" subtitle="Descubra as universidades e países com mais mobilidade"/>
        <div className="bg-[#FFFFFF] border border-gray-300 gap-4 rounded-xl  items-center p-5">
            <YearFilter value={yearFilter} onChange={setYearFilter} label={"Ano de referência"}/>

            <div>
                <Table columns={columnsUniversity} data={universityRanking}/>
            </div>
             <div>
                <Table columns={columnsCountry} data={countryRanking}/>
            </div>
        </div>
        </main>
        </div>
  )
}

export default Rankings