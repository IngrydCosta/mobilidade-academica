
import { useState } from "react"
import UniversityFilter from "../components/filters/UniversityFilter"
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import StudentNumberInput from "../components/StudentNumberInput"
import Title from "../components/ui/Title"



function CadastroMobilidade() {

  const [sentStudents, setSentStudents] = useState(0);
  const [receivedStudents, setReceivedStudents] = useState(0);

  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-10">
        <Title title="Cadastro de Mobilidade" subtitle="Registe novos dados de mobilidade no sistema" />
        <section className=" p-6  bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 ">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <UniversityFilter />
            <YearFilter />
          </div>
          <div className="flex flex-row gap-2">
            <StudentNumberInput label="Estudantes Enviados" value={sentStudents} onChange={setSentStudents} />
            <StudentNumberInput label="Estudantes Recebidos" value={receivedStudents} onChange={setReceivedStudents} />
          </div>

          <div>
            <button>
              <p>Salvar Registo</p>
            </button>
            <p>Limpar</p>
            <button>

            </button>
          </div>
        </section>

        <section>
          <div className="bg-linear-to-br from-[#0E284E]  to-[#17498b] rounded-lg mt-5">
            <Title title="Prévia do Registo" size="text-2xl" className="text-[#D4A969]" />

            <div>
              <p>UNIVERSIDADE</p>
              <p>UNIVERSIDADE</p>
              <p>UNIVERSIDADE</p>
              <div>
                <p>UNIVERSIDADE</p>
                <p>UNIVERSIDADE</p>
              </div>
              <div>
                <p>UNIVERSIDADE</p>
                <p>UNIVERSIDADE</p>
              </div>

            </div>


          </div>
        </section>

    <section className=" p-6  bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 ">
      <div>
        <Title title="Instruções" size="text-2xl"/>
        <p><span>1. Ano 2020</span></p>
        <p><span>2. Estudantes Enviados 0</span></p>
        <p><span>3. Estudantes Recebidos 0</span></p>
        <p><span>4. Total: 30</span></p>
      </div>
    </section>

      </main>
    </div>
  )
}

export default CadastroMobilidade
