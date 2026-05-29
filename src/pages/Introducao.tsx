import Card from "../components/Card";
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import { BiWorld } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { BsStars } from "react-icons/bs";


function Introducao() {
  return (
    <div className="flex min-h-screen ">
        <Sidebar />

        <main>
        <Title  title="Introdução" subtitle="Conceitos fundamentais sobre mobilidade estudantil"/>
        <div className="flex flex-col gap-2  p-4">
          <section>
            <div className="flex flex-col bg-linear-to-br from-[#0E284E]  to-[#17498b] rounded-lg mt-5 p-8 items-center">
            
              <Title title="O que é Mobilidade Estudantil?" size="text-4xl" className="text-[#D4A969] flex flex-col items-center" icon={<BiWorld  className="text-3xl"/>} />
         

              <div className="text-[#d4d3ce] flex flex-col gap-2">
                <p className="flex flex-col">  
                   <strong>A mobilidade estudantil é o movimento de estudantes entre instituições de ensino superior, dentro de um mesmo país ou internacionalmente. Permite vivenciar diferentes culturas académicas, expandir horizontes intelectuais e desenvolver competências interculturais essenciais.</strong>
                </p>
                </div>
                 </div>
                </section>

                <section className="flex flex-row md:flex-col gap-4">
                    <Title title="Importância da Mobilidade Estudantil" size="text-4xl" />
                    <div className="flex flex-col md:flex-row gap-4 p-3">
                    <Card icon={<FaUserFriends />} title="Desenvolvimento Pessoal" subtitle="Promove o crescimento pessoal através da exposição a novas culturas, línguas e perspetivas."/>
                    <Card icon={<FaBookOpen />} title="Excelência Académica" subtitle="Acesso a metodologias de ensino, recursos especializados e expertise académica em outras instituições."/>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 p-3">
                 <Card icon={<BiWorld />} title="Visão Global" subtitle="Forma cidadãos preparados para o mundo globalizado e mercados internacionais." />
                    <Card icon={<BsStars />} title="Rede Internacional" subtitle="Constrói uma rede duradoura de contactos académicos e profissionais."/>
                    </div>
                </section>
                </div>
                </main>
    </div>

  )
}

export default Introducao