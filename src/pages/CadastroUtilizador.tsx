import React, { useState } from "react";
import Sidebar from "../components/Sidebar"
import Title from "../components/ui/Title"
import Input from "../components/ui/Input";
import Table, { type Column } from "../components/Table";
import UniversityFilter from "../components/filters/UniversityFilter";

const columns: Column<UserData>[] = [
  {
    header: "NOME",
    accessor: "nome",
  },

  {
    header: "EMAIL",
    accessor: "email",
  },

  {
    header: "PERFIL",
    accessor: "perfil",
  },

  {
    header: "UNIVERSIDADE",
    accessor: "universidade",
  },
];

const initialUsers: UserData[] = [
  {
    nome: "Ana Silva",
    email: "ana@universidade.eu",
    perfil: "Administrador",
    universidade: "Universidade de Lisboa",
  },

  {
    nome: "Carlos Mendes",
    email: "carlos@universidade.eu",
    perfil: "Gestor de Mobilidade",
    universidade: "Universidade de Coimbra",
  },

  {
    nome: "Laura de Jesus",
    email: "lauradejesus@universidade.eu",
    perfil: "Estudante",
    universidade: "Sorbonne Université",
  },
];

type UserData = {
  nome: string;
  email: string;
  perfil: string;
  universidade: string;
};

function CadastroUtilizador() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [universityFilter, setUniversityFilter] = useState("");

  function handleSave(e?: React.SyntheticEvent) {
    e?.preventDefault();

    const newUser: UserData = {
      nome: name,
      email: email,
      perfil: profile,
      universidade: universityFilter,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    setName("");
    setEmail("");
    setPassword("");
    setProfile("");
  }

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

                  <UniversityFilter  value={universityFilter} onChange={setUniversityFilter} />

                <Input
                  label='Palavra-passe'
                  type='password'
                  placeholder='......'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />


                <div className="flex flex-col w-full">
                  <label htmlFor="profile" className="text-[#404c4e] font-medium text-md">Perfil</label>
                  <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2">
                    <select
  name="profile"
  id="profile"
  value={profile}
  onChange={(e) => setProfile(e.target.value)}
  className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full"
>
  <option value="Estudante">Estudante</option>
  <option value="Gestor de Mobilidade">Gestor de Mobilidade</option>
  <option value="Administrador">Administrador</option>
</select>
                  </div>

                  
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