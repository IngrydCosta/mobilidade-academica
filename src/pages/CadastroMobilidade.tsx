import { useEffect, useRef, useState } from "react";
import UniversityFilter from "../components/filters/UniversityFilter";
import YearFilter from "../components/filters/YearFilter";
import SemesterFilter from "../components/filters/SemesterFilter";
import Sidebar from "../components/Sidebar";
import StudentNumberInput from "../components/StudentNumberInput";
import Title from "../components/ui/Title";
import SaveButton from "../components/ui/SaveButton";
import ClearButton from "../components/ui/ClearButton";
import axios from "axios";
import { BsDownload } from "react-icons/bs";
import { IoCloudUploadOutline } from "react-icons/io5";
import * as XLSX from "xlsx";

type MobilityData = {
  id: string;
  nome: string;
  pais: string;
};

type StudentFromSheet = {
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
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadUniversities() {
      try {
        const resposta = await axios.get("http://localhost:3333/university", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUniversities(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar universidades", error);
      }
    }

    loadUniversities();

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
          if (!paisOrigem) {
            alert(`Erro na linha ${lineNum}: O campo "PAÍS DE ORIGEM" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!paisDestino) {
            alert(`Erro na linha ${lineNum}: O campo "PAÍS DE DESTINO" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!rawTipo) {
            alert(`Erro na linha ${lineNum}: O campo "TIPO DE MOBILIDADE" é obrigatório (use "ENVIADO" ou "RECEBIDO").`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!cursoOrigem) {
            alert(`Erro na linha ${lineNum}: O campo "CURSO DE ORIGEM" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!cursoDestino) {
            alert(`Erro na linha ${lineNum}: O campo "CURSO DE DESTINO" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!universidadeOrigem) {
            alert(`Erro na linha ${lineNum}: O campo "UNIVERSIDADE DE ORIGEM" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          if (!universidadeDestino) {
            alert(`Erro na linha ${lineNum}: O campo "UNIVERSIDADE DE DESTINO" é obrigatório.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          const normTipo = normalize(rawTipo);
          let tipoFinal = "";

          if (["ENVIADO", "ENVIADOS", "SAIDA", "OUTBOUND"].includes(normTipo)) {
            tipoFinal = "ENVIADO";
            sentCount++;
          } else if (["RECEBIDO", "RECEBIDOS", "ENTRADA", "INBOUND"].includes(normTipo)) {
            tipoFinal = "RECEBIDO";
            receivedCount++;
          } else {
            alert(
              `Erro na linha ${lineNum}: O campo "TIPO DE MOBILIDADE" ("${rawTipo}") é inválido. Utilize "ENVIADO" ou "RECEBIDO".`
            );
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
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

    if (studentsFromSheet.length === 0) {
      alert("Por favor, importe a planilha com os estudantes da mobilidade.");
      return;
    }

    if (sentStudents === 0 && receivedStudents === 0) {
      alert("Nenhum estudante enviado ou recebido foi identificado na planilha.");
      return;
    }

    const token = localStorage.getItem("token");

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Mobilidade cadastrada com sucesso e planilha importada!");
      clearFilters();
    } catch (error: any) {
      console.error("Erro ao cadastrar mobilidade:", error);
      alert(error.response?.data?.message || "Erro ao cadastrar mobilidade.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen ">
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
                  readOnly
                  disabled
                />
                <StudentNumberInput
                  label="Estudantes Recebidos"
                  value={receivedStudents}
                  readOnly
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full">
                <button className="border border-gray-300 text-[#173764] font-bold px-5 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 w-full">
                  <BsDownload />
                  <a href={download} download="modelo-mobilidade.xlsx">
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
            <div className="flex flex-col bg-linear-to-br from-[#0E284E] to-[#17498b] rounded-lg mt-5 p-8 min-w-[280px]">
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

        <section className="p-6 bg-[#FFFFFF] border border-gray-300 rounded-lg mt-5">
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
      </main>
    </div>
  );
}

export default CadastroMobilidade;
