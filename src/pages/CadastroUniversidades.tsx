
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Input from "../components/ui/Input";
import Card from "../components/Card";
import SaveButton from "../components/ui/SaveButton";
import { FaUniversity } from "react-icons/fa";
import  axios  from 'axios';


const initialUniversity: UniversityData[] = [
  {
    icon: "",
    nome: "Universidade de Lisboa",
    pais: "Portugal",
   
  },

  {
    icon: "",
    nome: "Universidade de Coimbra",
    pais: "Portugal",
   
  },

   {
    icon: "",
    nome: "Sorbonne Université",
    pais: "França",
   
  },

  {
    icon: "",
    nome: "Ludwig-Maximilians-Universität",
    pais: "Alemanha",
   
  },

  {
    icon: "",
    nome: "Sapienza Università",
    pais: "Itália",
   
  },
  
  {
    icon: "",
    nome: "Universidad de Barcelona",
    pais: "Espanha",
   
  },
  
];

type UniversityData = {
  icon: string;
  nome: string;
  pais: string;
};

function CadastroUniversidades() {

  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [country,setCountry] = useState("");
  const [university, setUniversity] = useState<UniversityData[]>(initialUniversity);

  useEffect(() =>{
   async function findUniversity(){
        const resposta = await axios.get('http://localhost:5173/university')
        
        setUniversity(resposta.data)
    }
    findUniversity()
  }, [])
  
  async function handleSave(e?: React.SyntheticEvent) {
      e?.preventDefault();

     await axios.post('http://localhost:5173/university', {
        icon: icon,
        nome: name,
        pais: country
      })
    
    setIcon("");
    setName("");
    setCountry("");

  }

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 md:px-10 py-4">
          <Title title="Cadastro de Universidades" subtitle="Cadastre sua universidade e participe do Projeto"/>
          <div className="flex flex-col md:flex-row gap-4">
            <section className="flex flex-col p-10 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1">
                <div className='flex flex-col w-full'>
                          <h3 className='text-2xl text-[#0E284E] font-serif mb-8'>Adicionar Universidade</h3>
                          <form className='space-y-6' onSubmit={handleSave}>
                            <Input
                              label='Nome da Universidade'
                              type='name'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />

                            <div className="flex flex-col w-full">
                            <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2">
                            <select
                                name="country"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"
                              >
                                <option value="Portugal">Portugal</option>
                                <option value="Espanha">Espanha</option>
                                <option value="Franca">França</option>
                                <option value="Alemanha">Alemanha</option>
                                <option value="Italia">Itália</option>
                              </select>
                           </div>

                          <SaveButton onClick={handleSave} nameButton="Guardar" />
                      </div>
                  </form>
                </div>
              </section>

             <section className="flex-1">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

    {university.map((item, index) => (
      <Card
        key={index}
        icon={<FaUniversity />}
        title={item.nome}
        subtitle={item.pais}
      />
    ))}

  </div>
</section>
               </div>
     </main>

  </div>
        
  )
}

export default CadastroUniversidades