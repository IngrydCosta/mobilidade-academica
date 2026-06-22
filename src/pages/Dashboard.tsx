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
       try{
        const resposta = await axios.get("http://localhost:3333/dashboard/public", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
          console.log('api', resposta.data);

        setDashboard(resposta.data); 
    } catch (error) {
      console.error("Erro ao buscar dashboard", error);
    }
  }
      findDashboard();
    }, []);

    return (
        <div className="flex flex-col gap-10">
            <Navbar />

            <div>
                <div className=" text-[#0E284E]">
                    <h1 className="font-medium text-5xl p-2 ml-2"><span>{t("title")}</span> </h1>
                    <h2 className="font-light p-2 ml-3 text-[#404c4e]"><span>{t("subtitle")}</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <section className=" grid grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-4">
                             <Card title="TOTAL DE MOBILIDADES" icon={<PiStudentFill className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]"/>} number={dashboard?.cards.total ?? 0} />
                             <Card title="ESTUDANTES ENVIADOS" icon={<FiSend className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.enviados ?? 0}/>
                             <Card title="ESTUDANTES RECEBIDOS" icon={<RiUserReceived2Line className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.recebidos ?? 0}/>
                             <Card title="ANO COM MAIOR MOBILIDADE" icon={<PiMedal className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />} number={dashboard?.cards.anoTop ?? 0}/> 
                           </section>
                </div>
            </div>

            <div className="bg-[#FFFFFF] shadow-lg p-5 ml-5 mr-5 rounded-lg">
                <span className="text-[#0E284E] font-medium text-3xl"><span>{t("graphic")}</span></span>
                <GraficoRow dashboardData={dashboard} />
            </div>

           <div className="bg-linear-to-br from-[#0E284E] to-[#17498b] text-[#d4d3ce] ml-5 mr-5 mb-4 rounded-lg p-3">

  <div className="flex flex-col gap-2 p-3">
    <div className="flex flex-row gap-2 items-center">
      <TbWorldCheck />
      <span>{t("indicator1")}</span>
    </div>
    <span className="text-[#E1B56F] ml-5 text-2xl">
      {dashboard?.indicators?.mediaPorAno ?? 0}
    </span>
  </div>

  <div className="flex flex-col gap-2 p-3">
    <div className="flex flex-row gap-2 items-center">
      <MdOutlineSchool />
      <span>{t("indicator2")}</span>
    </div>
    <span className="text-[#E1B56F] ml-5 text-2xl">
      {dashboard?.indicators?.universidades ?? 0}
    </span>
  </div>

  <div className="flex flex-col gap-2 p-3">
    <div className="flex flex-row gap-2 items-center">
      <TbWorldPin />
      <span>{t("indicator3")}</span>
    </div>
    <span className="text-[#E1B56F] ml-5 text-2xl">
      {dashboard?.indicators?.paises ?? 0}
    </span>
  </div>

</div>
        </div>

    )
}


export default Dashboard;