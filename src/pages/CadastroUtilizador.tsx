import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/ui/Title";
import Input from "../components/ui/Input";
import UniversityFilter from "../components/filters/UniversityFilter";
import axios from "axios";
import SaveButton from "../components/ui/SaveButton";
import Button from "../components/ui/Button";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

type UserData = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  universityId?: string | null;
  university?: {
    id: string;
    nome: string;
  } | null;
};

function CadastroUtilizador() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setProfile] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [universityId, setUniversityId] = useState<string>("");

  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editProfile, setEditProfile] = useState<string>("");
  const [editUniversityId, setEditUniversityId] = useState("");

  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("@mobilidade:token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  async function fetchUsers() {
    try {
      const resposta = await axios.get("http://localhost:3333/user", getHeaders());
      setUsers(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar utilizadores", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e?.preventDefault();

    if (!name || !email || !perfil || perfil === "Selecione") {
      showToast("Preencha todos os campos obrigatórios (Nome, E-mail e Perfil).", "warning");
      return;
    }

    if (perfil === "GESTOR_MOBILIDADE" && !universityId) {
      showToast("Para o perfil de Gestor de Mobilidade, a universidade é obrigatória.", "warning");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3333/user",
        {
          nome: name,
          email: email,
          perfil: perfil,
          universityId: (perfil === "GESTOR_MOBILIDADE" || perfil === "ESTUDANTE") ? (universityId || undefined) : undefined,
        },
        getHeaders()
      );

      showToast("Utilizador criado com sucesso! Uma palavra-passe aleatória foi gerada automaticamente e enviada para o e-mail do utilizador.", "success");

      setName("");
      setEmail("");
      setProfile("");
      setUniversityId("");
      fetchUsers();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Erro ao criar utilizador.", "error");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await axios.put(
        `http://localhost:3333/user/${editingUser.id}`,
        {
          nome: editName,
          email: editEmail,
          perfil: editProfile,
          universityId: (editProfile === "GESTOR_MOBILIDADE" || editProfile === "ESTUDANTE") ? editUniversityId : undefined,
        },
        getHeaders()
      );

      showToast("Utilizador atualizado com sucesso!", "success");

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao atualizar utilizador.", "error");
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingUser) return;

    try {
      await axios.delete(`http://localhost:3333/user/${deletingUser.id}`, getHeaders());
      showToast("Utilizador excluído com sucesso!", "success");
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao excluir utilizador.", "error");
    }
  }

  function startEdit(user: UserData) {
    setEditingUser(user);
    setEditName(user.nome);
    setEditEmail(user.email);
    setEditProfile(user.perfil);
    setEditUniversityId(user.universityId || "");
  }

  const formatPerfilLabel = (p: string) => {
    switch (p) {
      case "ADMINISTRADOR":
        return "Administrador";
      case "GESTOR_MOBILIDADE":
        return "Gestor de Mobilidade";
      case "ESTUDANTE":
        return "Estudante";
      default:
        return p;
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const perfilLabel = formatPerfilLabel(u.perfil).toLowerCase();
    return (
      u.nome.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      perfilLabel.includes(term) ||
      (u.university?.nome && u.university.nome.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const emptyRows = itemsPerPage - paginatedUsers.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-4">
        <Title title="Gestão de Utilizadores" subtitle="Crie utilizadores com senha automática por e-mail, edite e atribua perfis" />

        <div className="flex flex-col md:flex-row items-start gap-4">
          <section className='flex flex-col p-6 md:p-8 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1 w-full'>
            <div className='flex flex-col w-full'>
              <h3 className='text-2xl text-[#0E284E] font-serif mb-6'>Novo Utilizador</h3>
              <p className="text-xs text-gray-500 mb-6">
                Ao cadastrar, a palavra-passe será gerada <strong>automática e aleatoriamente</strong> pelo sistema e enviada para o e-mail do utilizador.
              </p>
              <form className='space-y-6' onSubmit={handleSave}>
                <Input
                  label='Nome'
                  type='text'
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

                <div className="flex flex-col w-full">
                  <label htmlFor="perfil" className="text-[#404c4e] font-medium text-md mb-1">Perfil</label>
                  <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2 mb-4">
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
                </div>

                {(perfil === "GESTOR_MOBILIDADE" || perfil === "ESTUDANTE") && (
                  <UniversityFilter value={universityId} onChange={setUniversityId} />
                )}

                <SaveButton onClick={handleSave} nameButton="Guardar Utilizador" />
              </form>
            </div>
          </section>

          <section className="flex flex-col justify-between p-6 md:p-8 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1 w-full">
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-2xl text-[#0E284E] font-serif mb-6">Utilizadores</h3>

                <div className="relative mt-4 mb-4">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, e-mail ou perfil..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm text-gray-700 outline-none"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm table-fixed">
                    <thead className="bg-[#F3F6F8] text-[#404c4e]">
                      <tr className="h-[45px]">
                        <th className="p-3 w-3/12 whitespace-nowrap truncate max-w-0" title="NOME">NOME</th>
                        <th className="p-3 w-3/12 whitespace-nowrap truncate max-w-0" title="EMAIL">EMAIL</th>
                        <th className="p-3 w-2/12 whitespace-nowrap truncate max-w-0" title="PERFIL">PERFIL</th>
                        <th className="p-3 w-2/12 whitespace-nowrap truncate max-w-0" title="UNIVERSIDADE">UNIVERSIDADE</th>
                        <th className="p-3 w-2/12 text-right whitespace-nowrap">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.length === 0 ? (
                        <tr className="h-[360px]">
                          <td colSpan={5} className="p-4 text-center text-gray-500 align-middle">
                            Nenhum utilizador encontrado.
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 h-[48px]">
                              <td className="p-3 font-medium text-gray-800 whitespace-nowrap truncate max-w-0" title={u.nome}>
                                {u.nome}
                              </td>
                              <td className="p-3 text-gray-600 whitespace-nowrap truncate max-w-0" title={u.email}>
                                {u.email}
                              </td>
                              <td className="p-3 text-gray-800 font-medium whitespace-nowrap truncate max-w-0" title={formatPerfilLabel(u.perfil)}>
                                {formatPerfilLabel(u.perfil)}
                              </td>
                              <td className="p-3 text-gray-600 whitespace-nowrap truncate max-w-0" title={u.university?.nome ?? "-"}>
                                {u.university?.nome ?? "-"}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => startEdit(u)}
                                    title="Editar"
                                    className="p-1 text-[#0E284E] hover:text-[#173764] cursor-pointer"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => setDeletingUser(u)}
                                    title="Excluir"
                                    className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {emptyRows > 0 &&
                            Array.from({ length: emptyRows }).map((_, idx) => (
                              <tr key={`empty-${idx}`} className="border-b border-gray-200/50 h-[48px]">
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="flex justify-end gap-3 invisible" aria-hidden="true">
                                    <button tabIndex={-1} className="p-1"><FiEdit2 size={16} /></button>
                                    <button tabIndex={-1} className="p-1"><FiTrash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <span>
                  Página {currentPage} de {totalPages} ({filteredUsers.length} registos)
                </span>
                <div className="flex gap-2">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="!w-auto px-4 py-2 text-sm"
                  >
                    Anterior
                  </Button>
                  <Button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="!w-auto px-4 py-2 text-sm"
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h4 className="text-xl font-bold text-[#0E284E] mb-4 font-serif">Editar Utilizador</h4>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="Nome"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />

                <div className="flex flex-col w-full">
                  <label htmlFor="editProfile" className="text-[#404c4e] font-medium text-sm mb-1">
                    Perfil
                  </label>
                  <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2">
                    <select
                      name="editProfile"
                      id="editProfile"
                      value={editProfile}
                      onChange={(e) => setEditProfile(e.target.value)}
                      className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full text-sm"
                    >
                      <option value="ESTUDANTE">Estudante</option>
                      <option value="GESTOR_MOBILIDADE">Gestor de Mobilidade</option>
                      <option value="ADMINISTRADOR">Administrador</option>
                    </select>
                  </div>
                </div>

                {(editProfile === "GESTOR_MOBILIDADE" || editProfile === "ESTUDANTE") && (
                  <div>
                    <UniversityFilter value={editUniversityId} onChange={setEditUniversityId} />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h4 className="text-lg font-bold text-red-600 mb-2 font-serif">Excluir Utilizador</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tem certeza que deseja excluir o utilizador <strong>{deletingUser.nome}</strong> ({deletingUser.email})?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CadastroUtilizador;