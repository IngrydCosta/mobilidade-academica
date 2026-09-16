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
import { useToast } from "../context/ToastContext";
import { API_URL } from "../services/api";

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
  const { showToast } = useToast();
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
  const [editSemester, setEditSemester] = useState<number>(1);
  const [editUniversityId, setEditUniversityId] = useState<string>("");

  const [editingStudent, setEditingStudent] = useState<StudentFromSheet | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [studentForm, setStudentForm] = useState<StudentFromSheet>({
    matricula: "",
    nome: "",
    email: "",
    paisOrigem: "",
    paisDestino: "",
    tipoMobilidade: "ENVIADO",
    cursoOrigem: "",
    cursoDestino: "",
    universidadeOrigem: "",
    universidadeDestino: "",
  });

  const [deletingMobility, setDeletingMobility] = useState<MobilityRecord | null>(null);
  const [deletingStudentConfirm, setDeletingStudentConfirm] = useState<StudentFromSheet | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("@mobilidade:token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  async function fetchMobilities() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/mobility`, getHeaders());
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
        const resposta = await axios.get<MobilityData[]>(`${API_URL}/university`, getHeaders());
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
      showToast("Por favor, selecione a universidade antes de importar a planilha.", "warning");
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
          showToast("A planilha selecionada está vazia.", "warning");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const headerRows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        if (!headerRows || headerRows.length === 0) {
          showToast("A planilha não possui dados ou cabeçalho.", "warning");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const rawHeaders = headerRows[0] || [];
        const normalizedHeaders = rawHeaders.map((h) => normalize(String(h)));

        const missingHeaders = REQUIRED_COLUMNS.filter(
          (col) => !normalizedHeaders.includes(normalize(col))
        );

        if (missingHeaders.length > 0) {
          showToast(
            `A planilha está fora do formato esperado. Colunas ausentes: ${missingHeaders.join(", ")}`,
            "error"
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
          showToast("Nenhuma linha de estudante encontrada na planilha.", "warning");
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
            showToast(`Erro na linha ${lineNum}: O campo "Nº DE MATRÍCULA DO ESTUDANTE" é obrigatório.`, "error");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!nome) {
            showToast(`Erro na linha ${lineNum}: O campo "NOME DO ESTUDANTE" é obrigatório.`, "error");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!email) {
            showToast(`Erro na linha ${lineNum}: O campo "EMAIL DO ESTUDANTE" é obrigatório.`, "error");
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
        showToast("Erro ao processar o ficheiro da planilha. Verifique se o formato está correto.", "error");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  async function handleSave(e?: React.SyntheticEvent) {
    e?.preventDefault();

    const currentUnivId = isGestor ? user?.universityId : universityId;

    if (!currentUnivId) {
      showToast("Selecione uma universidade.", "warning");
      return;
    }

    if (!yearFilter) {
      showToast("Selecione o ano.", "warning");
      return;
    }

    if (!semesterFilter) {
      showToast("Selecione o semestre.", "warning");
      return;
    }

    try {
      setIsSaving(true);

      await axios.post(
        `${API_URL}/mobility`,
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

      showToast("Mobilidade cadastrada com sucesso!", "success");
      clearFilters();
      fetchMobilities();
    } catch (error: unknown) {
      console.error("Erro ao cadastrar mobilidade:", error);
      if (axios.isAxiosError(error)) {
        showToast(error.response?.data?.message || "Erro ao cadastrar mobilidade.", "error");
      } else {
        showToast("Erro ao cadastrar mobilidade.", "error");
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
        `${API_URL}/mobility/${editingMobility.id}`,
        {
          ano: editYear,
          semestre: editSemester,
          universityId: editUniversityId,
        },
        getHeaders()
      );

      showToast("Registo de mobilidade atualizado com sucesso!", "success");
      setEditingMobility(null);
      fetchMobilities();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao atualizar registo de mobilidade.", "error");
    }
  }

  async function refreshEditingMobility(mobilityId: string) {
    try {
      const res = await axios.get(`${API_URL}/mobility/${mobilityId}`, getHeaders());
      setEditingMobility(res.data);
      fetchMobilities();
    } catch (err) {
      console.error("Erro ao atualizar mobilidade em edição", err);
    }
  }

  async function handleUpdateStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStudent || !editingStudent.id || !editingMobility) return;

    try {
      await axios.put(
        `${API_URL}/mobility/students/${editingStudent.id}`,
        editingStudent,
        getHeaders()
      );
      showToast("Estudante atualizado com sucesso!", "success");
      setEditingStudent(null);
      refreshEditingMobility(editingMobility.id);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao atualizar estudante.", "error");
    }
  }

  async function handleDeleteStudent(studentId: string) {
    if (!editingMobility) return;

    try {
      await axios.delete(`${API_URL}/mobility/students/${studentId}`, getHeaders());
      showToast("Estudante removido com sucesso!", "success");
      refreshEditingMobility(editingMobility.id);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao remover estudante.", "error");
    }
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMobility) return;

    if (!studentForm.nome || !studentForm.email || !studentForm.matricula) {
      showToast("Preencha todos os campos obrigatórios (Nome, E-mail e Matrícula).", "warning");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/mobility/${editingMobility.id}/students`,
        studentForm,
        getHeaders()
      );
      showToast("Estudante adicionado com sucesso!", "success");
      setShowAddStudentModal(false);
      setStudentForm({
        matricula: "",
        nome: "",
        email: "",
        paisOrigem: "",
        paisDestino: "",
        tipoMobilidade: "ENVIADO",
        cursoOrigem: "",
        cursoDestino: "",
        universidadeOrigem: "",
        universidadeDestino: "",
      });
      refreshEditingMobility(editingMobility.id);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao adicionar estudante.", "error");
    }
  }

  async function handleDeleteMobilityConfirm() {
    if (!deletingMobility) return;

    try {
      await axios.delete(`${API_URL}/mobility/${deletingMobility.id}`, getHeaders());
      showToast("Registo de mobilidade excluído com sucesso!", "success");
      setDeletingMobility(null);
      fetchMobilities();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro ao excluir registo de mobilidade.", "error");
    }
  }

  function startEdit(item: MobilityRecord) {
    setEditingMobility(item);
    setEditYear(item.ano);
    setEditSemester(item.semestre || 1);
    setEditUniversityId(item.universityId);
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

        <section className="p-6 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-6">
          <div>
            <Title title="Instruções para o Registo" size="text-2xl" />
            <div className="flex flex-col gap-2 mt-3 text-[#404c4e]">
              <p>
                <strong>1. Seleção:</strong> Escolha a Universidade, o Ano e o Semestre de referência.
              </p>
              <p>
                <strong>2. Planilha Modelo:</strong> Baixe o modelo e preencha todos os campos obrigatórios dos estudantes (Matrícula, Nome, Email, Países de Origem/Destino, Tipo de Mobilidade, Cursos e Universidades de Origem/Destino).
              </p>
              <p>
                <strong>3. Contagem Automática:</strong> Ao importar a planilha, o sistema contabilizará instantaneamente os estudantes <strong>Enviados</strong> e <strong>Recebidos</strong> com base no Tipo de Mobilidade de cada aluno.
              </p>
              <p>
                <strong>4. Confirmação e Salvamento:</strong> Confira os totais calculados na Prévia e clique em <strong>Salvar Registo</strong> para concluir o cadastro.
              </p>
            </div>
          </div>
        </section>

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
                        <th className="p-3 w-3/12 whitespace-nowrap">UNIVERSIDADE</th>
                        <th className="p-3 w-2/12 whitespace-nowrap">PAÍS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">ANO</th>
                        <th className="p-3 w-2/12 whitespace-nowrap">SEMESTRE</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">ENVIADOS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">RECEBIDOS</th>
                        <th className="p-3 w-1/12 whitespace-nowrap">TOTAL</th>
                        <th className="p-3 w-1/12 text-right whitespace-nowrap">AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr className="h-[360px]">
                          <td colSpan={8} className="p-4 text-center text-gray-500 align-middle">
                            Carregando mobilidades...
                          </td>
                        </tr>
                      ) : paginatedMobilities.length === 0 ? (
                        <tr className="h-[360px]">
                          <td colSpan={8} className="p-4 text-center text-gray-500 align-middle">
                            Nenhum registo de mobilidade encontrado.
                          </td>
                        </tr>
                      ) : (
                        <>
                          {paginatedMobilities.map((item) => (
                            <React.Fragment key={item.id}>
                              <tr className="border-b border-gray-200 hover:bg-gray-50 font-normal h-[45px] box-border">
                                <td className="p-3 text-gray-800 whitespace-nowrap truncate max-w-0" title={item.university?.nome || "N/A"}>
                                  {item.university?.nome || "N/A"}
                                </td>
                                <td className="p-3 text-gray-600 whitespace-nowrap truncate max-w-0" title={item.university?.pais || "N/A"}>
                                  {item.university?.pais || "N/A"}
                                </td>
                                <td className="p-3 text-gray-600 whitespace-nowrap">{item.ano}</td>
                                <td className="p-3 text-gray-600 whitespace-nowrap">{item.semestre ? `${item.semestre}º Semestre` : "-"}</td>
                                <td className="p-3 text-gray-600 whitespace-nowrap">{item.enviados}</td>
                                <td className="p-3 text-gray-600 whitespace-nowrap">{item.recebidos}</td>
                                <td className="p-3 text-gray-600 whitespace-nowrap">{item.enviados + item.recebidos}</td>
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
                                      className="p-1 text-[#173764] hover:text-[#0E284E] cursor-pointer"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-xl my-8 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <div>
                  <h4 className="text-xl font-bold text-[#0E284E] font-serif">Editar Registo de Mobilidade</h4>
                </div>
                <button
                  onClick={() => setEditingMobility(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto flex-1 pr-1 space-y-6">
                <form onSubmit={handleUpdateMobility} className="space-y-4 bg-[#F8FAFC] p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-sm text-[#0E284E] uppercase tracking-wider">Dados do Lote</h5>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <UniversityFilter
                        value={editUniversityId}
                        onChange={setEditUniversityId}
                        disabled={isGestor}
                      />
                    </div>

                    <div>
                      <YearFilter
                        value={String(editYear)}
                        onChange={(val) => setEditYear(Number(val))}
                      />
                    </div>

                    <div>
                      <SemesterFilter
                        value={editSemester}
                        onChange={(val) => setEditSemester(Number(val))}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 items-center pt-2 text-sm text-gray-700 font-medium">
                    <span>Enviados: <strong>{editingMobility.enviados}</strong></span>
                    <span>Recebidos: <strong>{editingMobility.recebidos}</strong></span>
                    <span>Total: <strong>{editingMobility.enviados + editingMobility.recebidos}</strong></span>
                    <span className="text-xs text-gray-400 font-normal">
                      (calculado automaticamente)
                    </span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-[#173764] text-white font-medium rounded-md hover:bg-[#0E284E] cursor-pointer transition-colors"
                    >
                      Salvar Dados do Lote
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-semibold text-base text-[#0E284E]">
                      Estudantes no Lote ({editingMobility.students?.length || 0})
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentForm({
                          matricula: "",
                          nome: "",
                          email: "",
                          paisOrigem: editingMobility.university?.pais || "",
                          paisDestino: "",
                          tipoMobilidade: "ENVIADO",
                          cursoOrigem: "",
                          cursoDestino: "",
                          universidadeOrigem: editingMobility.university?.nome || "",
                          universidadeDestino: "",
                        });
                        setShowAddStudentModal(true);
                      }}
                      className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer font-medium transition-colors"
                    >
                      + Adicionar Estudante
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-[#F3F6F8] text-[#404c4e] sticky top-0">
                        <tr>
                          <th className="p-2.5">MATRÍCULA</th>
                          <th className="p-2.5">NOME</th>
                          <th className="p-2.5">EMAIL</th>
                          <th className="p-2.5">TIPO</th>
                          <th className="p-2.5">CURSO ORIGEM</th>
                          <th className="p-2.5 text-right">AÇÕES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!editingMobility.students || editingMobility.students.length === 0) ? (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500">
                              Nenhum estudante neste lote de mobilidade.
                            </td>
                          </tr>
                        ) : (
                          editingMobility.students.map((st) => (
                            <tr key={st.id || st.matricula} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-2.5 font-mono text-gray-700">{st.matricula}</td>
                              <td className="p-2.5 font-medium text-gray-800">{st.nome}</td>
                              <td className="p-2.5 text-gray-600">{st.email}</td>
                              <td className="p-2.5 text-gray-700 font-medium">
                                {st.tipoMobilidade}
                              </td>
                              <td className="p-2.5 text-gray-600 truncate max-w-[120px]" title={st.cursoOrigem}>{st.cursoOrigem || "-"}</td>
                              <td className="p-2.5 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingStudent(st)}
                                    className="p-1 text-[#0E284E] hover:text-blue-700 cursor-pointer"
                                    title="Editar Estudante"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingStudentConfirm(st)}
                                    className="p-1 text-[#173764] hover:text-[#0E284E] cursor-pointer"
                                    title="Excluir Estudante"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingMobility(null)}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer font-medium"
                >
                  Concluir / Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {editingStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
              <h4 className="text-lg font-bold text-[#0E284E] mb-4 font-serif">Editar Estudante</h4>
              <form onSubmit={handleUpdateStudent} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Matrícula</label>
                    <input
                      type="text"
                      value={editingStudent.matricula}
                      onChange={(e) => setEditingStudent({ ...editingStudent, matricula: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Tipo de Mobilidade</label>
                    <select
                      value={editingStudent.tipoMobilidade}
                      onChange={(e) => setEditingStudent({ ...editingStudent, tipoMobilidade: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs cursor-pointer"
                    >
                      <option value="ENVIADO">ENVIADO</option>
                      <option value="RECEBIDO">RECEBIDO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Nome do Estudante</label>
                  <input
                    type="text"
                    value={editingStudent.nome}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nome: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Curso Origem</label>
                    <input
                      type="text"
                      value={editingStudent.cursoOrigem}
                      onChange={(e) => setEditingStudent({ ...editingStudent, cursoOrigem: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Curso Destino</label>
                    <input
                      type="text"
                      value={editingStudent.cursoDestino}
                      onChange={(e) => setEditingStudent({ ...editingStudent, cursoDestino: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-[#173764] text-white rounded hover:bg-[#0E284E] cursor-pointer font-medium"
                  >
                    Salvar Estudante
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
              <h4 className="text-lg font-bold text-[#0E284E] mb-4 font-serif">Adicionar Estudante</h4>
              <form onSubmit={handleAddStudent} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Matrícula *</label>
                    <input
                      type="text"
                      value={studentForm.matricula}
                      onChange={(e) => setStudentForm({ ...studentForm, matricula: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                      placeholder="Ex: 2024001"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Tipo de Mobilidade</label>
                    <select
                      value={studentForm.tipoMobilidade}
                      onChange={(e) => setStudentForm({ ...studentForm, tipoMobilidade: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs cursor-pointer"
                    >
                      <option value="ENVIADO">ENVIADO</option>
                      <option value="RECEBIDO">RECEBIDO</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Nome do Estudante *</label>
                  <input
                    type="text"
                    value={studentForm.nome}
                    onChange={(e) => setStudentForm({ ...studentForm, nome: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">E-mail *</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                    placeholder="email@estudante.eu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Curso Origem</label>
                    <input
                      type="text"
                      value={studentForm.cursoOrigem}
                      onChange={(e) => setStudentForm({ ...studentForm, cursoOrigem: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Curso Destino</label>
                    <input
                      type="text"
                      value={studentForm.cursoDestino}
                      onChange={(e) => setStudentForm({ ...studentForm, cursoDestino: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-[#173764] text-white rounded hover:bg-[#0E284E] cursor-pointer font-medium"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletingMobility && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h4 className="text-lg font-bold text-[#0E284E] mb-2 font-serif">Excluir Mobilidade</h4>
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
                  className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingStudentConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h4 className="text-lg font-bold text-[#0E284E] mb-2 font-serif">Excluir Estudante</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tem certeza que deseja excluir o estudante <strong>{deletingStudentConfirm.nome}</strong> (Matrícula: {deletingStudentConfirm.matricula}) deste lote de mobilidade?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingStudentConfirm(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deletingStudentConfirm.id) {
                      handleDeleteStudent(deletingStudentConfirm.id);
                    }
                    setDeletingStudentConfirm(null);
                  }}
                  className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer"
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
