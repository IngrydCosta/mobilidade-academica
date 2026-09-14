import { useEffect, useState } from "react";
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Table, { type Column } from "../components/Table";
import Button from "../components/ui/Button";
import axios from "axios";
import { API_URL } from "../services/api";



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

  const [pageUni, setPageUni] = useState(1);
  const [pageCountry, setPageCountry] = useState(1);
  const itemsPerPage = 8;

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
        const resposta = await axios.get(`${API_URL}/ranking`, {
          headers: {Authorization: `Bearer ${token}` },
          params: { year: yearFilter },
        });

        setUniversityRanking(resposta.data.universityRanking || []);
        setCountryRanking(resposta.data.countryRanking || []);
        setPageUni(1);
        setPageCountry(1);
      } catch (error) {
        console.error("Erro ao buscar ranking", error);
      }

    }
    findRanking();
  }, [yearFilter]);

  const totalPagesUni = Math.ceil(universityRanking.length / itemsPerPage) || 1;
  const paginatedUniversityRanking = universityRanking.slice(
    (pageUni - 1) * itemsPerPage,
    pageUni * itemsPerPage
  );

  const totalPagesCountry = Math.ceil(countryRanking.length / itemsPerPage) || 1;
  const paginatedCountryRanking = countryRanking.slice(
    (pageCountry - 1) * itemsPerPage,
    pageCountry * itemsPerPage
  );

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
          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between gap-4 min-h-[500px]">
            <div>
              <h2 className="text-[#0E284E] text-xl font-medium mb-4">
                Ranking por Universidade
              </h2>
              <Table columns={columnsUniversity} data={paginatedUniversityRanking} />
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <span>
                Página {pageUni} de {totalPagesUni} ({universityRanking.length} registos)
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={pageUni === 1}
                  onClick={() => setPageUni((p) => Math.max(p - 1, 1))}
                  className="!w-auto px-4 py-2 text-sm"
                >
                  Anterior
                </Button>
                <Button
                  disabled={pageUni >= totalPagesUni}
                  onClick={() => setPageUni((p) => Math.min(p + 1, totalPagesUni))}
                  className="!w-auto px-4 py-2 text-sm"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </section>

          <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between gap-4 min-h-[500px]">
            <div>
              <h2 className="text-[#0E284E] text-xl font-medium mb-4">
                Ranking por País
              </h2>
              <Table columns={columnsCountry} data={paginatedCountryRanking} />
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <span>
                Página {pageCountry} de {totalPagesCountry} ({countryRanking.length} registos)
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={pageCountry === 1}
                  onClick={() => setPageCountry((p) => Math.max(p - 1, 1))}
                  className="!w-auto px-4 py-2 text-sm"
                >
                  Anterior
                </Button>
                <Button
                  disabled={pageCountry >= totalPagesCountry}
                  onClick={() => setPageCountry((p) => Math.min(p + 1, totalPagesCountry))}
                  className="!w-auto px-4 py-2 text-sm"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Rankings