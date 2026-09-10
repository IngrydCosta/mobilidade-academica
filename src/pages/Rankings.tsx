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
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-6 flex flex-col gap-6">
        <Title
          title="Ranking do Estudante"
          subtitle="Descubra as universidades e países com mais mobilidade"
        />

        <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="max-w-xs">
            <YearFilter
              value={yearFilter}
              onChange={setYearFilter}
              label="Ano de referência"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col gap-4">
            <h2 className="text-[#0E284E] text-xl font-medium">
              Ranking por Universidade
            </h2>
            <Table columns={columnsUniversity} data={universityRanking} />
          </section>

          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col gap-4">
            <h2 className="text-[#0E284E] text-xl font-medium">
              Ranking por País
            </h2>
            <Table columns={columnsCountry} data={countryRanking} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Rankings