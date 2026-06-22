
import { useEffect, useState } from "react"
import UniversityFilter from "../components/filters/UniversityFilter"
import YearFilter from "../components/filters/YearFilter"
import Sidebar from "../components/Sidebar"
import StudentNumberInput from "../components/StudentNumberInput"
import Title from "../components/ui/Title"
import SaveButton from "../components/ui/SaveButton"
import ClearButton from "../components/ui/ClearButton"
import axios from "axios"

type MobilityData = {
  id: string;
  nome: string;
  pais: string;
};


function CadastroMobilidade() {

  
  const [yearFilter, setYearFilter] = useState("")
  const [sentStudents, setSentStudents] = useState(0);
  const [receivedStudents, setReceivedStudents] = useState(0);
  const [universityId, setUniversityId] = useState("");
  const [universities, setUniversities] = useState<MobilityData[]>([]);
  
 

 useEffect(() => {
  const token = localStorage.getItem("token");

  async function loadUniversities() {
    const resposta = await axios.get("http://localhost:3333/university", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUniversities(resposta.data);
  }

  loadUniversities();
}, []);

 const selectedUniversity = universities.find(
    (u) => u.id === universityId
  );

  const country = selectedUniversity?.pais || "-";

  const totalStudents = sentStudents + receivedStudents;


  function clearFilters(){

  setUniversityId("");
  setYearFilter("");
  setSentStudents(0);
  setReceivedStudents(0);

}


async function handleSave(e?: React.SyntheticEvent) {
  e?.preventDefault();

  
  if (!universityId) {
    alert("Selecione uma universidade");
    return;
  }

  if (!yearFilter) {
    alert("Selecione o ano");
    return;
  }

  if (sentStudents === 0 && receivedStudents === 0) {
    alert("Informe pelo menos um estudante enviado ou recebido");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    console.log("=== DADOS SENDO ENVIADOS ===");
console.log("universityId:", universityId);
console.log("universityId length:", universityId?.length);

    await axios.post("http://localhost:3333/mobility", {
      ano: Number(yearFilter),
      enviados: sentStudents,
      recebidos: receivedStudents,
      universityId: universityId,   
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Mobilidade cadastrada com sucesso!");
    clearFilters();
  } catch (error) {
    console.error("Erro ao cadastrar: ", error);
    alert("Erro ao cadastrar mobilidade. ");
  }
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
                <UniversityFilter value={universityId} onChange={setUniversityId} />
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
                   <strong>UNIVERSIDADE</strong> {selectedUniversity?.nome || "-"}
                </p>
             
                <p className="flex flex-col">
                  <strong>PAÍS</strong>{country}
               
                </p>

                <p className="flex flex-col">
                  <strong>ANO</strong>{yearFilter || "-"}
                 
                </p>
                <div>
                  <p className="flex flex-col">
                    <strong>ENVIADOS</strong>{sentStudents}
                    
                  </p>
                  <p className="flex flex-col">
                    <strong>RECEBIDOS</strong>{receivedStudents}
                    
                  </p>
                </div>
                <div>
                  <p>
                    <strong>TOTAL</strong>  {totalStudents}
                   
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
  );
}

export default CadastroMobilidade;
