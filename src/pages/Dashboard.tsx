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

type DashboardData = {

  totalMobilidades: number;
  totalEnviados: number;
  totalRecebidos: number;
  anoComMaiorMobilidade: number;
  
};



function Dashboard() {

   const { t } = useTranslation();
   const [dashboard, setDashboard] = useState<DashboardData | null>(null);

useEffect(() => {
    const token = localStorage.getItem("token");
  
      async function findDashboard() {
        const resposta = await axios.get("http://localhost:3333/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
          console.log(resposta.data);
  
        setDashboard(resposta.data);
      }
      findDashboard();
    }, []);
console.log(dashboard)
    return (
        <div className="flex flex-col gap-10">
            <Navbar />

            <div>
                <div className=" text-[#0E284E]">
                    <h1 className="font-medium text-5xl p-2 ml-2"><span>{t("title")}</span> </h1>
                    <h2 className="font-light p-2 ml-3 text-[#404c4e]"><span>{t("subtitle")}</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]"><span>{t("card1")}</span></span>
                            <span className="text-[#0E284E] font-bold text-2xl">{dashboard?.totalMobilidades ?? 0}</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"><PiStudentFill className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]"><span>{t("card2")}</span></span>
                            <span className="text-[#0E284E] font-bold text-2xl">{dashboard?.totalEnviados ?? 0}</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"> <FiSend className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]"><span>{t("card3")}</span></span>
                            <span className="text-[#0E284E] font-bold text-2xl">{dashboard?.totalRecebidos ?? 0}</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"> <RiUserReceived2Line className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-10 py-10 rounded-lg flex items-center justify-between ml-5 ">
                        <div className="flex flex-col">
                            <span className="text-[#404c4e]"><span>{t("card4")}</span></span>
                            <span className="text-[#0E284E] font-bold text-2xl">{dashboard?.anoComMaiorMobilidade ?? 0}</span>
                        </div>
                        <span className="bg-[#E7EAED] p-3 rounded-lg"><PiMedal className=" h-6 w-6 md:h-7 md:w-7 text-[#0E284E]" />
                        </span>
                    </div>

                </div>
            </div>


            <div className="bg-[#FFFFFF] shadow-lg p-5 ml-5 mr-5 rounded-lg">
                <span className="text-[#0E284E] font-medium text-3xl"><span>{t("graphic")}</span></span>
                <GraficoRow />
            </div>

            <div className="bg-linear-to-br from-[#0E284E]  to-[#17498b] text-[#d4d3ce] ml-5 mr-5 mb-4 rounded-lg p-3">

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><TbWorldCheck /><span><span>{t("indicator1")}</span></span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">631</span>
                </div>

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><MdOutlineSchool /> <span><span>{t("indicator2")}</span></span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">6</span>
                </div>

                <div className="flex flex-col gap-2 p-3">
                    <div className="flex flex-row gap-2 items-center"><TbWorldPin />  <span><span>{t("indicator3")}</span></span></div>
                    <span className="text-[#E1B56F] ml-5 text-2xl">5</span>
                </div>

            </div>
        </div>

    )
}


export default Dashboard;