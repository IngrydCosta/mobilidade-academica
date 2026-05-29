import { useState } from "react";
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Table, { type Column } from "../components/Table";


type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
};

type RankingUniversityData = {
  universidade: string;
  pais: string;
  total: number;
};

type RankingCountryData = {
  pais: string;
  total: number;
};

const mobilityData: MobilityData[] = [
  {
    universidade: "Universidade de Lisboa",
    pais: "Portugal",
    ano: 2025,
    enviados: 49,
    recebidos: 58,
  },

  {
    universidade: "Universidade de Coimbra",
    pais: "Portugal",
    ano: 2025,
    enviados: 64,
    recebidos: 61,
  },

  {
    universidade: "Sorbonne Université",
    pais: "França",
    ano: 2025,
    enviados: 74,
    recebidos: 53,
  },

  {
    universidade: "Universidad de Barcelona",
    pais: "Espanha",
    ano: 2025,
    enviados: 62,
    recebidos: 63,
  },

  {
    universidade: "Ludwig-Maximilians-Universität",
    pais: "Alemanha",
    ano: 2025,
    enviados: 73,
    recebidos: 45,
  },

  {
    universidade: "Sapienza Università",
    pais: "Itália",
    ano: 2025,
    enviados: 65,
    recebidos: 48,
  },

  {
    universidade: "Universidade de Lisboa",
    pais: "Portugal",
    ano: 2024,
    enviados: 30,
    recebidos: 40,
  },

  {
    universidade: "Sorbonne Université",
    pais: "França",
    ano: 2024,
    enviados: 90,
    recebidos: 50,
  },
];


const universityColumns: Column<RankingUniversityData>[] = [
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
    header: "TOTAL",
    accessor: "total",
    className:"text-[#404c4e] font-bold"
  },
];

const countryColumns: Column<RankingCountryData>[] = [
  {
    header: "PAÍS",
    accessor: "pais",
    className: "text-[#0E284E] font-bold",
  },

  {
    header: "TOTAL",
    accessor: "total",
    className: "text-[#404c4e] font-bold",
  },
];



function Rankings() {

    const [yearFilter, setYearFilter] = useState("2025");

    const filteredData = mobilityData.filter(
        (item) => item.ano === Number(yearFilter)
    );

    const universityRanking: RankingUniversityData[] = filteredData
    .map((item) => ({
      universidade: item.universidade,
      pais: item.pais,
      total: item.enviados + item.recebidos,
    }))
    .sort((a, b) => b.total - a.total);

    const countryRanking: RankingCountryData[] = filteredData
    .reduce((acc, item) => {
      const existingCountry = acc.find(
        (country) => country.pais === item.pais
      );

 
 const total = item.enviados + item.recebidos;

      if (existingCountry) {
        existingCountry.total += total;
      } else {
        acc.push({
          pais: item.pais,
          total,
        });
      }

      return acc;
    }, [] as RankingCountryData[])
    .sort((a, b) => b.total - a.total);


  return (
    <div className="flex min-h-screen ">
        <Sidebar />

        <main className="flex flex-col gap-4 p-4">
        <Title  title="Ranking do Estudante" subtitle="Descubra as universidades e países com mais mobilidade"/>
        <div className="bg-[#FFFFFF] border border-gray-300 gap-4 rounded-xl  items-center p-5">
            <YearFilter value={yearFilter} onChange={setYearFilter} label={"Ano de referência"} showAllOption={false} />

            <div>
                <Table columns={universityColumns} data={universityRanking}/>
            </div>
             <div>
                <Table columns={countryColumns} data={countryRanking}/>
            </div>
        </div>
        </main>
        </div>
  )
}

export default Rankings