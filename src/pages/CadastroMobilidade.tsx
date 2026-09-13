import React, { useEffect, useRef, useState } from "react";
import UniversityFilter from "../components/filters/UniversityFilter";
import YearFilter from "../components/filters/YearFilter";
import SemesterFilter from "../components/filters/SemesterFilter";
import Sidebar from "../components/Sidebar";
import StudentNumberInput from "../components/StudentNumberInput";
import Title from "../components/ui/Title";
import SaveButton from "../components/ui/SaveButton";
import ClearButton from "../components/ui/ClearButton";
import Button from "../components/ui/Button";
import axios from "axios";
import { BsDownload } from "react-icons/bs";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";

type MobilityData = {
  id: string;
  nome: string;
  pais: string;
};

type User = {
  id?: string;
  nome?: string;
  email?: string;
  perfil?: string;
  universityId?: string;
};

type StudentFromSheet = {
  id?: string;
  matricula: string;
  nome: string;
  email: string;
  paisOrigem: string;
  paisDestino: string;
  tipoMobilidade: string;
  cursoOrigem: string;
  cursoDestino: string;
  universidadeOrigem: string;
  universidadeDestino: string;
};

type MobilityRecord = {
  id: string;
  ano: number;
  semestre: number;
  enviados: number;
  recebidos: number;
  universityId: string;
  university: {
    id: string;
    nome: string;
    pais: string;
  };
  students: StudentFromSheet[];
};

const REQUIRED_COLUMNS = [
  "Nº DE MATRÍCULA DO ESTUDANTE",
  "NOME DO ESTUDANTE",
  "EMAIL DO ESTUDANTE",
  "PAÍS DE ORIGEM",
  "PAÍS DE DESTINO",
  "TIPO DE MOBILIDADE",
  "CURSO DE ORIGEM",
  "CURSO DE DESTINO",
  "UNIVERSIDADE DE ORIGEM",
  "UNIVERSIDADE DE DESTINO",
] as const;

function normalize(str: string): string {
  return (str || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

const download = "/arquivos/modelo-mobilidade.xlsx";

function CadastroMobilidade() {
  const userStr = localStorage.getItem("user") || localStorage.getItem("@mobilidade:user");
  const user: User | null = userStr ? (JSON.parse(userStr) as User) : null;
  const isGestor = user?.perfil === "GESTOR_MOBILIDADE";

  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [sentStudents, setSentStudents] = useState(0);
  const [receivedStudents, setReceivedStudents] = useState(0);
  const [universityId, setUniversityId] = useState(
    isGestor && user?.universityId ? user.universityId : ""
  );
  const [universities, setUniversities] = useState<MobilityData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [studentsFromSheet, setStudentsFromSheet] = useState<StudentFromSheet[]>([]);
  const [mobilities, setMobilities] = useState<MobilityRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [editingMobility, setEditingMobility] = useState<MobilityRecord | null>(null);
  const [editYear, setEditYear] = useState<number>(2024);
  const [editEnviados, setEditEnviados] = useState<number>(0);
  const [editRecebidos, setEditRecebidos] = useState<number>(0);

  const [deletingMobility, setDeletingMobility] = useState<MobilityRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("@mobilidade:token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  async function fetchMobilities() {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3333/mobility", getHeaders());
      setMobilities(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar mobilidades:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadUniversities() {
      try {
        const resposta = await axios.get<MobilityData[]>("http://localhost:3333/university", getHeaders());
        setUniversities(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar universidades", error);
      }
    }

    loadUniversities();
    fetchMobilities();

    if (isGestor && user?.universityId) {
      setUniversityId(user.universityId);
    }
  }, []);

  const targetUnivId = isGestor ? user?.universityId : universityId;
  const selectedUniversity = universities.find((u) => u.id === targetUnivId);
  const country = selectedUniversity?.pais || "-";
  const totalStudents = sentStudents + receivedStudents;

  function clearFilters() {
    if (!isGestor) {
      setUniversityId("");
    }
    setYearFilter("");
    setSemesterFilter("");
    setSentStudents(0);
    setReceivedStudents(0);
    setFile(null);
    setStudentsFromSheet([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedUniversity || !selectedUniversity.pais) {
      alert("Por favor, selecione a universidade antes de importar a planilha.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          alert("A planilha selecionada está vazia.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const headerRows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        if (!headerRows || headerRows.length === 0) {
          alert("A planilha não possui dados ou cabeçalho.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const rawHeaders = headerRows[0] || [];
        const normalizedHeaders = rawHeaders.map((h) => normalize(String(h)));

        const missingHeaders = REQUIRED_COLUMNS.filter(
          (col) => !normalizedHeaders.includes(normalize(col))
        );

        if (missingHeaders.length > 0) {
          alert(
            `A planilha está fora do formato esperado.\nColunas obrigatórias ausentes:\n- ${missingHeaders.join(
              "\n- "
            )}`
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const colIndices: Record<string, number> = {};
        REQUIRED_COLUMNS.forEach((col) => {
          colIndices[col] = normalizedHeaders.indexOf(normalize(col));
        });

        const rows = headerRows.slice(1).filter(
          (r) =>
            r &&
            r.some(
              (c) => c !== undefined && c !== null && String(c).trim() !== ""
            )
        );

        if (rows.length === 0) {
          alert("Nenhuma linha de estudante encontrada na planilha.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const parsedStudents: StudentFromSheet[] = [];
        let sentCount = 0;
        let receivedCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const lineNum = i + 2;

          const matricula = String(row[colIndices["Nº DE MATRÍCULA DO ESTUDANTE"]] ?? "").trim();
          const nome = String(row[colIndices["NOME DO ESTUDANTE"]] ?? "").trim();
          const email = String(row[colIndices["EMAIL DO ESTUDANTE"]] ?? "").trim();
          const paisOrigem = String(row[colIndices["PAÍS DE ORIGEM"]] ?? "").trim();
          const paisDestino = String(row[colIndices["PAÍS DE DESTINO"]] ?? "").trim();
          const rawTipo = String(row[colIndices["TIPO DE MOBILIDADE"]] ?? "").trim();
          const cursoOrigem = String(row[colIndices["CURSO DE ORIGEM"]] ?? "").trim();
          const cursoDestino = String(row[colIndices["CURSO DE DESTINO"]] ?? "").trim();
          const universidadeOrigem = String(row[colIndices["UNIVERSIDADE DE ORIGEM"]] ?? "").trim();
          const universidadeDestino = String(row[colIndices["UNIVERSIDADE DE DESTINO"]] ?? "").trim();

          if (!matricula) {
            alert(`Erro na linha ${lineNum}: O campo "Nº DE MATRÍCULA DO ESTUDANTE" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!nome) {
            alert(`Erro na linha ${lineNum}: O campo "NOME DO ESTUDANTE" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!email) {
            alert(`Erro na linha ${lineNum}: O campo "EMAIL DO ESTUDANTE" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          const normTipo = normalize(rawTipo);
          let tipoFinal = "ENVIADO";

          if (["ENVIADO", "ENVIADOS", "SAIDA", "OUTBOUND"].includes(normTipo)) {
            tipoFinal = "ENVIADO";
            sentCount++;
          } else if (["RECEBIDO", "RECEBIDOS", "ENTRADA", "INBOUND"].includes(normTipo)) {
            tipoFinal = "RECEBIDO";
            receivedCount++;
          } else {
            sentCount++;
          }

          parsedStudents.push({
            matricula,
            nome,
            email,
            paisOrigem,
            paisDestino,
            tipoMobilidade: tipoFinal,
            cursoOrigem,
            cursoDestino,
            universidadeOrigem,
            universidadeDestino,
          });
        }

        setStudentsFromSheet(parsedStudents);
        setSentStudents(sentCount);
        setReceivedStudents(receivedCount);
        setFile(selectedFile);
      } catch (err) {
        console.error("Erro ao ler planilha:", err);
        alert("Erro ao processar o ficheiro da planilha. Verifique se o formato está correto.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  async function handleSave(e?: React.SyntheticEvent) {
    e?.preventDefault();

    const currentUnivId = isGestor ? user?.universityId : universityId;

    if (!currentUnivId) {
      alert("Selecione uma universidade.");
      return;
    }

    if (!yearFilter) {
      alert("Selecione o ano.");
      return;
    }

    if (!semesterFilter) {
      alert("Selecione o semestre.");
      return;
    }

    try {
      setIsSaving(true);

      await axios.post(
        "http://localhost:3333/mobility",
        {
          ano: Number(yearFilter),
          semestre: Number(semesterFilter),
          enviados: sentStudents,
          recebidos: receivedStudents,
          universityId: currentUnivId,
          estudantes: studentsFromSheet,
        },
        getHeaders()
      );

      alert("Mobilidade cadastrada com sucesso!");
      clearFilters();
      fetchMobilities();
    } catch (error: unknown) {
      console.error("Erro ao cadastrar mobilidade:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Erro ao cadastrar mobilidade.");
      } else {
        alert("Erro ao cadastrar mobilidade.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateMobility(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMobility) return;

    try {
      await axios.put(
        `http://localhost:3333/mobility/${editingMobility.id}`,
        {
          ano: editYear,
          enviados: editEnviados,
          recebidos: editRecebidos,
          universityId: editingMobility.universityId,
        },
        getHeaders()
      );

      alert("Registo de mobilidade atualizado com sucesso!");
      setEditingMobility(null);
      fetchMobilities();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar registo de mobilidade.");
    }
  }

  async function handleDeleteMobilityConfirm() {
    if (!deletingMobility) return;

    try {
      await axios.delete(`http://localhost:3333/mobility/${deletingMobility.id}`, getHeaders());
      alert("Registo de mobilidade excluído com sucesso!");
      setDeletingMobility(null);
      fetchMobilities();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao excluir registo de mobilidade.");
    }
  }



  function startEdit(item: MobilityRecord) {
    setEditingMobility(item);
    setEditYear(item.ano);
    setEditEnviados(item.enviados);
    setEditRecebidos(item.recebidos);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 px-4 md:px-10 py-4">
        <Title
          title="Cadastro de Mobilidade"
          subtitle="Registe novos dados de mobilidade no sistema"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <section className="w-full p-6 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5 flex-1">
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UniversityFilter
                  value={universityId}
                  onChange={setUniversityId}
                  disabled={isGestor}
                />
                <YearFilter value={yearFilter} onChange={setYearFilter} />
                <SemesterFilter value={semesterFilter} onChange={setSemesterFilter} />
              </div>

              <div className="flex flex-row gap-4 mt-4 items-center w-full">
                <StudentNumberInput
                  label="Estudantes Enviados"
                  value={sentStudents}
                  onChange={setSentStudents}
                />
                <StudentNumberInput
                  label="Estudantes Recebidos"
                  value={receivedStudents}
                  onChange={setReceivedStudents}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full">
                <button className="border border-gray-300 text-[#173764] font-bold px-5 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 w-full cursor-pointer">
                  <BsDownload />
                  <a href={download} download="modelo-mobilidade.xlsx" className="no-underline text-[#173764]">
                    Baixar planilha modelo
                  </a>
                </button>

                <label className="border border-gray-300 text-[#173764] font-bold px-5 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 w-full cursor-pointer">
                  <IoCloudUploadOutline />
                  <span className="truncate max-w-[200px]">
                    {file ? file.name : "Importar planilha"}
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="w-full">
                  <SaveButton
                    onClick={handleSave}
                    nameButton={isSaving ? "Salvando..." : "Salvar Registo"}
                  />
                </div>

                <div className="w-full">
                  <ClearButton onClick={clearFilters} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col bg-gradient-to-br from-[#0E284E] to-[#17498b] rounded-lg mt-5 p-8 min-w-[280px]">
              <Title
                title="Prévia do Registo"
                size="text-2xl"
                className="text-[#D4A969]"
              />
              <div className="text-[#d4d3ce] flex flex-col gap-2">
                <p className="flex flex-col">
                  <strong>UNIVERSIDADE</strong>{" "}
                  {selectedUniversity?.nome || "-"}
                </p>

                <p className="flex flex-col">
                  <strong>PAÍS</strong>
                  {country}
                </p>

                <p className="flex flex-col">
                  <strong>ANO</strong>
                  {yearFilter || "-"}
                </p>

                <p className="flex flex-col">
                  <strong>SEMESTRE</strong>
                  {semesterFilter ? `${semesterFilter}º Semestre` : "-"}
                </p>

                <div>
                  <p className="flex flex-col">
                    <strong>ENVIADOS</strong>
                    {sentStudents}
                  </p>
                  <p className="flex flex-col">
                    <strong>RECEBIDOS</strong>
                    {receivedStudents}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>TOTAL</strong> {totalStudents}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {(() => {
          const filteredMobilities = mobilities.filter((item) => {
            const term = searchTerm.toLowerCase();
            const uniName = (item.university?.nome || "").toLowerCase();
            const uniCountry = (item.university?.pais || "").toLowerCase();
            const yearStr = String(item.ano);
            return uniName.includes(term) || uniCountry.includes(term) || yearStr.includes(term);
          });

          const totalPages = Math.ceil(filteredMobilities.length / itemsPerPage) || 1;
          const paginatedMobilities = filteredMobilities.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          );
          const emptyRows = itemsPerPage - paginatedMobilities.length;

          return (
            <section className="p-6 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-6 flex flex-col justify-between min-h-[560px]">
              <div>
                <h3 className="text-2xl text-[#0E284E] font-serif mb-6">Registos de Mobilidade no Sistema</h3>

                <div className="relative mt-4 mb-4 max-w-md">
                  <input
                    type="text"
                    placeholder="Pesquisar por universidade, país ou ano..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#F8FAFC] border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm text-gray-700 outline-none"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>

                <div className="overflow-x-auto min-h-[405px]">
                  <table className="w-full border-collapse text-left text-sm table-fixed">
                    <thead className="bg-[#F3F6F8] text-[#404c4e]">
                      <tr className="h-[45px]">
                        <th className="p-3 w-4/12 whitespace-nowrap">UNIVERSIDADE</th>
                        <th className="p-3 w-2/12 whitespace-nowrap">PAÍS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">ANO</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">ENVIADOS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">RECEBIDOS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">TOTAL</th>
                        <th className="p-3 w-2/12 text-right whitespace-nowrap">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr className="h-[360px]">
                          <td colSpan={7} className="p-4 text-center text-gray-500 align-middle">
                            Carregando mobilidades...
                          </td>
                        </tr>
                      ) : paginatedMobilities.length === 0 ? (
                        <tr className="h-[360px]">
                          <td colSpan={7} className="p-4 text-center text-gray-500 align-middle">
                            Nenhum registo de mobilidade encontrado.
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedMobilities.map((item) => (
                            <React.Fragment key={item.id}>
                              <tr className="border-b border-gray-200 hover:bg-gray-50 font-medium h-[45px] box-border">
                                <td className="p-3 text-gray-800 whitespace-nowrap truncate max-w-0" title={item.university?.nome || "N/A"}>
                                  {item.university?.nome || "N/A"}
                                </td>
                                <td className="p-3 text-gray-600 whitespace-nowrap truncate max-w-0" title={item.university?.pais || "N/A"}>
                                  {item.university?.pais || "N/A"}
                                </td>
                                <td className="p-3 text-gray-800 whitespace-nowrap">{item.ano}</td>
                                <td className="p-3 text-blue-600 font-semibold whitespace-nowrap">{item.enviados}</td>
                                <td className="p-3 text-green-600 font-semibold whitespace-nowrap">{item.recebidos}</td>
                                <td className="p-3 font-bold text-gray-800 whitespace-nowrap">{item.enviados + item.recebidos}</td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="flex justify-end gap-3">
                                    <button
                                      onClick={() => startEdit(item)}
                                      title="Editar Mobilidade"
                                      className="p-1 text-[#0E284E] hover:text-[#173764] cursor-pointer"
                                    >
                                      <FiEdit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => setDeletingMobility(item)}
                                      title="Excluir Mobilidade"
                                      className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                                    >
                                      <FiTrash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                          {emptyRows > 0 &&
                            Array.from({ length: emptyRows }).map((_, idx) => (
                              <tr key={`empty-${idx}`} className="border-b border-gray-100 h-[45px]">
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                                <td className="p-3 whitespace-nowrap">&nbsp;</td>
                              </tr>
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <span>
                  Página {currentPage} de {totalPages} ({filteredMobilities.length} registos)
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
            </section>
          );
        })()}

        {editingMobility && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h4 className="text-xl font-bold text-[#0E284E] mb-4 font-serif">Editar Registo de Mobilidade</h4>
              <form onSubmit={handleUpdateMobility} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Universidade</label>
                  <input
                    type="text"
                    disabled
                    value={editingMobility.university?.nome || ""}
                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-sm text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Ano</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <StudentNumberInput label="Enviados" value={editEnviados} onChange={setEditEnviados} />
                  </div>
                  <div className="flex-1">
                    <StudentNumberInput label="Recebidos" value={editRecebidos} onChange={setEditRecebidos} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingMobility(null)}
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

        {deletingMobility && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h4 className="text-lg font-bold text-red-600 mb-2 font-serif">Excluir Mobilidade</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tem certeza que deseja excluir este registo de mobilidade de{" "}
                <strong>{deletingMobility.university?.nome}</strong> ({deletingMobility.ano})?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingMobility(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMobilityConfirm}
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

export default CadastroMobilidade;
