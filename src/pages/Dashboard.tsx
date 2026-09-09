import Navbar from "../components/Navbar";
import { PiStudentFill } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import { RiUserReceived2Line } from "react-icons/ri";
import { PiMedal } from "react-icons/pi";
import { TbWorldPin } from "react-icons/tb";
import { TbWorldCheck } from "react-icons/tb";
import { MdOutlineSchool } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GraficoRow from "../components/GraficoRow";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

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
  indicators?: {
    universidades: number;
    totalRegistros: number;
    mediaPorAno: number;
    paises: number;
  };
};



function Dashboard() {

   const { t } = useTranslation();
   const [dashboard, setDashboard] = useState<DashboardData | null>(null);

useEffect(() => {
    const token = localStorage.getItem("token");
  
      async function findDashboard() {
        try {
          const resposta = await axios.get("http://localhost:3333/dashboard/public", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDashboard(resposta.data); 
        } catch (error) {
          console.error("Erro ao buscar dashboard", error);
        }
      }
      findDashboard();
    }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 md:px-10 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="text-[#0E284E]">
          <h1 className="font-semibold text-3xl md:text-5xl">
            {t("title")}
          </h1>
          <h2 className="font-light text-base md:text-lg text-[#404c4e] mt-2">
            {t("subtitle")}
          </h2>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card
            title={t("card1")}
            icon={<PiStudentFill className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />}
            number={dashboard?.cards.total ?? 0}
          />
          <Card
            title={t("card2")}
            icon={<FiSend className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />}
            number={dashboard?.cards.enviados ?? 0}
          />
          <Card
            title={t("card3")}
            icon={<RiUserReceived2Line className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />}
            number={dashboard?.cards.recebidos ?? 0}
          />
          <Card
            title={t("card4")}
            icon={<PiMedal className="h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />}
            number={dashboard?.cards.anoTop ?? 0}
          />
        </section>

        <section className="bg-white shadow-sm border border-gray-300 p-6 rounded-lg flex flex-col gap-4">
          <span className="text-[#0E284E] font-medium text-2xl md:text-3xl">
            {t("graphic")}
          </span>
          <GraficoRow dashboardData={dashboard} />
        </section>

        <section className="bg-linear-to-br from-[#0E284E] to-[#17498b] text-[#d4d3ce] rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row gap-2 items-center text-lg">
                <TbWorldCheck className="h-5 w-5 text-[#E1B56F]" />
                <span>{t("indicator1")}</span>
              </div>
              <span className="text-[#E1B56F] text-3xl font-bold ml-7">
                {dashboard?.indicators?.mediaPorAno ?? 0}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row gap-2 items-center text-lg">
                <MdOutlineSchool className="h-5 w-5 text-[#E1B56F]" />
                <span>{t("indicator2")}</span>
              </div>
              <span className="text-[#E1B56F] text-3xl font-bold ml-7">
                {dashboard?.indicators?.universidades ?? 0}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row gap-2 items-center text-lg">
                <TbWorldPin className="h-5 w-5 text-[#E1B56F]" />
                <span>{t("indicator3")}</span>
              </div>
              <span className="text-[#E1B56F] text-3xl font-bold ml-7">
                {dashboard?.indicators?.paises ?? 0}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


export default Dashboard;