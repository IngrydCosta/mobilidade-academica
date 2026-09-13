import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Title from "../components/ui/Title";
import Input from "../components/ui/Input";
import SaveButton from "../components/ui/SaveButton";
import Button from "../components/ui/Button";
import { FiEdit2, FiSearch } from "react-icons/fi";
import axios from "axios";
import { useToast } from "../context/ToastContext";

type UniversityData = {
  id: string;
  icon?: string;
  nome: string;
  pais: string;
};

function CadastroUniversidades() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Selecione");
  const [university, setUniversity] = useState<UniversityData[]>([]);

  const [editingUniversity, setEditingUniversity] = useState<UniversityData | null>(null);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("@mobilidade:token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  async function fetchUniversities() {
    try {
      const resposta = await axios.get("http://localhost:3333/university", getHeaders());
      setUniversity(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar universidades", error);
    }
  }

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function handleSave(e?: React.SyntheticEvent) {
    e?.preventDefault();

    if (!name.trim()) {
      showToast("Informe o nome da universidade.", "warning");
      return;
    }

    if (!country || country === "Selecione") {
      showToast("Selecione um país.", "warning");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3333/university",
        {
          nome: name,
          pais: country,
        },
        getHeaders()
      );

      showToast("Universidade cadastrada com sucesso!", "success");
      setName("");
      setCountry("Selecione");
      fetchUniversities();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Erro ao cadastrar universidade.", "error");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUniversity) return;

    try {
      await axios.put(
        `http://localhost:3333/university/${editingUniversity.id}`,
        {
          nome: editName,
          pais: editCountry,
        },
        getHeaders()
      );

      showToast("Universidade atualizada com sucesso!", "success");
      setEditingUniversity(null);
      fetchUniversities();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao atualizar universidade.", "error");
    }
  }

  function startEdit(uni: UniversityData) {
    setEditingUniversity(uni);
    setEditName(uni.nome);
    setEditCountry(uni.pais);
  }

  const filteredUniversities = university.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.pais.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage) || 1;
  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const emptyRows = itemsPerPage - paginatedUniversities.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-4">
        <Title
          title="Cadastro de Universidades"
          subtitle="Cadastre sua universidade e participe do Projeto"
        />
        <div className="flex flex-col md:flex-row items-start gap-4">
          <section className="flex flex-col p-6 md:p-8 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1 w-full">
            <div className="flex flex-col w-full">
              <h3 className="text-2xl text-[#0E284E] font-serif mb-6">
                Adicionar Universidade
              </h3>
              <form className="space-y-6" onSubmit={handleSave}>
                <Input
                  label="Nome da Universidade"
                  type="text"
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
                      <option value="Selecione">Selecione o País</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Espanha">Espanha</option>
                      <option value="França">França</option>
                      <option value="Alemanha">Alemanha</option>
                      <option value="Itália">Itália</option>
                    </select>
                  </div>

                  <SaveButton onClick={handleSave} nameButton="Guardar" />
                </div>
              </form>
            </div>
          </section>

          <section className="flex flex-col justify-between p-6 md:p-8 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1 w-full">
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-2xl text-[#0E284E] font-serif mb-6">Universidades Parceiras</h3>

                <div className="relative mt-4 mb-4">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou país..."
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
                        <th className="p-3 w-6/12 whitespace-nowrap truncate max-w-0" title="NOME">NOME</th>
                        <th className="p-3 w-4/12 whitespace-nowrap truncate max-w-0" title="PAÍS">PAÍS</th>
                        <th className="p-3 w-2/12 text-right whitespace-nowrap">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUniversities.length === 0 ? (
                        <tr className="h-[360px]">
                          <td colSpan={3} className="p-4 text-center text-gray-500 align-middle">
                            Nenhuma universidade encontrada.
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedUniversities.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 h-[48px]">
                              <td className="p-3 font-medium text-gray-800 whitespace-nowrap truncate max-w-0" title={item.nome}>
                                {item.nome}
                              </td>
                              <td className="p-3 text-gray-600 whitespace-nowrap truncate max-w-0" title={item.pais}>
                                {item.pais}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => startEdit(item)}
                                    title="Editar"
                                    className="p-1 text-[#0E284E] hover:text-[#173764] cursor-pointer"
                                  >
                                    <FiEdit2 size={16} />
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
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="flex justify-end gap-3 invisible" aria-hidden="true">
                                    <button tabIndex={-1} className="p-1"><FiEdit2 size={16} /></button>
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
                  Página {currentPage} de {totalPages} ({filteredUniversities.length} registos)
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

        {editingUniversity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h4 className="text-xl font-bold text-[#0E284E] mb-4 font-serif">Editar Universidade</h4>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="Nome da Universidade"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <div className="flex flex-col w-full">
                  <label htmlFor="editCountry" className="text-[#404c4e] font-medium text-sm mb-1">
                    País
                  </label>
                  <div className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md p-2">
                    <select
                      name="editCountry"
                      id="editCountry"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="cursor-pointer text-[#2b2e2e] bg-transparent outline-none w-full text-sm"
                    >
                      <option value="Portugal">Portugal</option>
                      <option value="Espanha">Espanha</option>
                      <option value="França">França</option>
                      <option value="Alemanha">Alemanha</option>
                      <option value="Itália">Itália</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUniversity(null)}
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
      </main>
    </div>
  );
}

export default CadastroUniversidades;
