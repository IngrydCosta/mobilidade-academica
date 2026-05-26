
import { useState } from "react"
import UniversityFilter from "../components/filters/UniversityFilter"
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import StudentNumberInput from "../components/StudentNumberInput"
import Title from "../components/ui/Title"
import SaveButton from "../components/ui/SaveButton"
import ClearButton from "../components/ui/ClearButton"




function CadastroMobilidade() {

  const [universityFilter, setUniversityFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [sentStudents, setSentStudents] = useState(0);
  const [receivedStudents, setReceivedStudents] = useState(0);
  const universityCountryMap: Record<string, string> = {
  "Universidade de Lisboa": "Portugal",
  "Universidade de Coimbra": "Portugal",
  "Sorbonne Université": "França",
  "Sapienza Università": "Itália",
  "Universidad de Barcelona": "Espanha",
};

 const country = universityCountryMap[universityFilter] || "-";

 const totalStudents = sentStudents + receivedStudents;

  function clearFilters(){

  setUniversityFilter("");
  setYearFilter("");
  setSentStudents(0);
  setReceivedStudents(0);

}

function handleSave(){

  const mobilityRegister = {
    university: universityFilter,
    country,
    year: yearFilter,
    sentStudents,
    receivedStudents,
    total: totalStudents,


  };
   console.log(mobilityRegister)

}


  return (
    <div className="flex min-h-screen ">
      <Sidebar />

     <main className="flex-1 px-4 md:px-10 py-4">
        <Title title="Cadastro de Mobilidade" subtitle="Registe novos dados de mobilidade no sistema" />
        <div className="flex flex-col md:flex-row gap-4">
          <section className=" w-full p-6 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1">
            <div className="flex flex-col w-full">
              <div className="flex flex-row md:flex-col gap-4">
                <UniversityFilter value={universityFilter} onChange={setUniversityFilter} />
                <YearFilter value={yearFilter} onChange={setYearFilter} />
              </div>
              <div className="flex flex-row  gap-4 mt-4 items-center w-full">
                <StudentNumberInput label="Estudantes Enviados" value={sentStudents} onChange={setSentStudents} />
                <StudentNumberInput label="Estudantes Recebidos" value={receivedStudents} onChange={setReceivedStudents} />
              </div>


              <div className="flex flex-col md:flex-row gap-2 mt-4 w-full items-center">
                <SaveButton onClick={handleSave} nameButton="Salvar Registo"/>
                <ClearButton onClick={clearFilters}/>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col bg-linear-to-br from-[#0E284E]  to-[#17498b] rounded-lg mt-5 p-8">
              <Title title="Prévia do Registo" size="text-2xl" className="text-[#D4A969]" />

              <div className="text-[#d4d3ce] flex flex-col gap-2">
                <p className="flex flex-col">  
                   <strong>UNIVERSIDADE</strong>{" "}
                   {universityFilter || "-"}
                </p>
             
                <p className="flex flex-col">
                  <strong>PAÍS</strong>{" "}
                  {country}
                </p>
                <p className="flex flex-col">
                  <strong>ANO</strong>{" "}
                  {yearFilter || "-"}
                </p>
                <div>
                  <p className="flex flex-col">
                    <strong>ENVIADOS</strong>{" "}
                    {sentStudents || "-"}
                  </p>
                  <p className="flex flex-col">
                    <strong>RECEBIDOS</strong>{" "}
                    {receivedStudents || "-"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>TOTAL</strong>{" "}
                    {totalStudents}
                  </p>
                </div>

              </div>


            </div>
          </section>
        </div>

        <section className=" p-6  bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 ">
          <div>
            <Title title="Instruções" size="text-2xl" />
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
