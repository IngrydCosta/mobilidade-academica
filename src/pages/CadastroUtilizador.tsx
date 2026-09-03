import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Input from "../components/ui/Input";
import Table, { type Column } from "../components/Table";
import UniversityFilter from "../components/filters/UniversityFilter";
import axios from "axios";
import SaveButton from "../components/ui/SaveButton";


type UserData = {
  university?: {
    nome: string;
  };
  nome: string;
  email: string;
  perfil: string;
  universityId: string;
};



function CadastroUtilizador() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setProfile] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [universityId, setUniversityId] = useState<string>("");

  
  async function fetchUsers() {
    const token = localStorage.getItem("token");
    try {
      const resposta = await axios.get("http://localhost:3333/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar utilizadores", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleSave(e?: React.SyntheticEvent) {
    e?.preventDefault();

    if (!name || !email || !password || !perfil || perfil === "Selecione") {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (perfil === "GESTOR_MOBILIDADE" && !universityId) {
      alert("Para o perfil de Gestor de Mobilidade, a universidade é obrigatória.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3333/user",
        {
          nome: name,
          email: email,
          password: password,
          perfil: perfil,
          universityId: universityId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Utilizador criado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setProfile("");
      setUniversityId("");
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar utilizador.");
    }
  }

  const columns: Column<UserData>[] = [
  {
    header: "Nome",
    accessor: "nome",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Perfil",
    accessor: "perfil",
  },
  {
    header: "Universidade",
    render: (row) => row.university?.nome ?? "-",
  }
];

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-4">
        <Title title="Gestão de Utilizadores" subtitle="Crie utilizadores e atribua perfis" />
        <div className="flex flex-col md:flex-row gap-4">
          <section className='flex flex-col p-10 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1'>
            <div className='flex flex-col w-full'>
              <h3 className='text-2xl text-[#0E284E] font-serif mb-8'>Novo Utilizador</h3>
              <form className='space-y-6' onSubmit={handleSave}>
                <Input
                  label='Nome'
                  type='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label='Email'
                  type='email'
                  placeholder='email@universidade.eu'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                  <UniversityFilter  value={universityId} onChange={setUniversityId} />

                <Input
                  label='Palavra-passe'
                  type='password'
                  placeholder='......'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />


                <div className="flex flex-col w-full">
                  <label htmlFor="perfil" className="text-[#404c4e] font-medium text-md">Perfil</label>
                  <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2">
                    <select
                      name='perfil'
                      id='perfil'
                      value={perfil}
                      onChange={(e) => setProfile(e.target.value)}
                      className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"
                    >
                      <option>Selecione</option>
                      <option value="ESTUDANTE">Estudante</option>
                      <option value="GESTOR_MOBILIDADE">Gestor de Mobilidade</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                  </div>
              <SaveButton onClick={handleSave} nameButton="Guardar" />
                </div>
              </form>
            </div>
          </section>

          <section className="flex flex-col p-10 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1">
            <div>
              <Title title={"Utilizadores"} size="text-2xl" />
              <Table columns={columns} data={users} className="rounded-md"/>
            </div>
          </section>
        </div>
      </main>

    </div>

  )
}

export default CadastroUtilizador;