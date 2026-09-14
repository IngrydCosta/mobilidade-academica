import Card from "../components/Card";
import CountryFilter from "../components/filters/CountryFilter";
import UniversityFilter from "../components/filters/UniversityFilter";
import YearFilter from "../components/filters/YearFilter";
import Sidebar from "../components/Sidebar";
import Title from "../components/ui/Title";
import Button from "../components/ui/Button";
import { PiMedal, PiStudentFill } from "react-icons/pi";
import { FiSend, FiSearch } from "react-icons/fi";
import { RiUserReceived2Line } from "react-icons/ri";
import GraficoRow from "../components/GraficoRow";
import GraficoCol from "../components/GraficoCol";
import { useEffect, useState } from "react";
import axios from "axios";
import Table, { type Column } from "../components/Table";
import UniversityModal from "../components/UniversityModal";
import { API_URL } from "../services/api";

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
  table: MobilityData[];
  
};

type StudentData = {
  matricula: string;
  nome: string;
  email: string;
  paisOrigem: string;
  paisDestino: string;
  tipoMobilidade?: string;
  cursoOrigem: string;
  cursoDestino: string;
  universidadeOrigem?: string;
  universidadeDestino?: string;
};

type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
  total: number;
  students: StudentData[];
};

function DashboardInterno() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isGestor = user?.perfil === "GESTOR_MOBILIDADE";

  const [universityFilter, setUniversityFilter] = useState(isGestor && user?.universityId ? user.universityId : "");
  const [yearFilter, setYearFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMobility, setSelectedMobility] = useState<MobilityData | null>(null);

  const handleUniversityClick = (mobility: MobilityData) => {
    setSelectedMobility(mobility);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function findDashboard() {
      try {
        const resposta = await axios.get(`${API_URL}/dashboard/private`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            university: universityFilter || undefined,
            country: countryFilter || undefined,
            year: yearFilter ? Number(yearFilter) : undefined,
          },
        });

        setDashboard(resposta.data);
        setCurrentPage(1);
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
      render: (row: MobilityData) => (
        <span
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
          onClick={() => handleUniversityClick(row)}
        >
          {row.universidade}
        </span>
      ),
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
      accessor: "total",
    },
  ];

  const tableData = dashboard?.table || [];
  const filteredTableData = tableData.filter((item) => {
    const term = searchTerm.toLowerCase();
    const uniName = (item.universidade || "").toLowerCase();
    const countryName = (item.pais || "").toLowerCase();
    const yearStr = String(item.ano);
    return uniName.includes(term) || countryName.includes(term) || yearStr.includes(term);
  });

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage) || 1;
  const paginatedTableData = filteredTableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-6 flex flex-col gap-6">
        <Title title="Dashboard de Mobilidade" subtitle="Visão geral da mobilidade estudantil" />

        <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col gap-4">
          <h2 className="text-[#0E284E] text-xl font-medium">Filtros</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UniversityFilter value={universityFilter} onChange={setUniversityFilter} />
            <CountryFilter value={countryFilter} onChange={setCountryFilter} />
            <YearFilter value={yearFilter} onChange={setYearFilter} />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card title="TOTAL DE MOBILIDADES" icon={<PiStudentFill className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]"/>} number={dashboard?.cards.total ?? 0} />
          <Card title="ESTUDANTES ENVIADOS" icon={<FiSend className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.enviados ?? 0}/>
          <Card title="ESTUDANTES RECEBIDOS" icon={<RiUserReceived2Line className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.recebidos ?? 0}/>
          <Card title="ANO COM MAIOR MOBILIDADE" icon={<PiMedal className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.anoTop ?? 0}/> 
        </section>

        <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col gap-4">
          <Title title="Tendência de Mobilidade por Ano" size="text-2xl" className="mb-0"/>
          <GraficoRow dashboardData={dashboard} />
        </section>

        <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col gap-4">
          <Title title="Comparação Anual" size="text-2xl" className="mb-0"/>
          <GraficoCol dashboardData={dashboard}/>
        </section>

        <section className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between min-h-[560px]">
          <div>
            <Title title="Registos de Mobilidade" size="text-2xl" className="mb-4" />

            <div className="relative mb-4 max-w-md">
              <input
                type="text"
                placeholder="Pesquisar por universidade, país ou ano..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm text-gray-700 outline-none"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
            </div>

            <Table columns={columns} data={paginatedTableData} itemsPerPage={itemsPerPage} />
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <span>
              Página {currentPage} de {totalPages} ({filteredTableData.length} registos)
            </span>
            <div className="flex gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="!w-auto px-4 py-2 text-sm"
              >
                Anterior
              </Button>
              <Button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="!w-auto px-4 py-2 text-sm"
              >
                Próximo
              </Button>
            </div>
          </div>
        </section>

        <UniversityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mobility={selectedMobility}
        />
      </main>
    </div>
  );
}

export default DashboardInterno
