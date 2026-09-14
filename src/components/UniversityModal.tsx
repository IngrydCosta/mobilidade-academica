type StudentData = {
  matricula: string;
  nome: string;
  email: string;
  paisOrigem: string;
  paisDestino: string;
  tipoMobilidade?: string;
  cursoOrigem: string;
  cursoDestino: string;
  universidadeOrigem?: string;
  universidadeDestino?: string;
};

type MobilityData = {
  universidade: string;
  pais: string;
  ano: number;
  enviados: number;
  recebidos: number;
  total: number;
  students: StudentData[];
};

type UniversityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mobility: MobilityData | null;
};

export default function UniversityModal({
  isOpen,
  onClose,
  mobility,
}: UniversityModalProps) {
  if (!isOpen || !mobility) {
    return null;
  }

  const students = mobility.students ?? [];
  const isRedacted = students.length > 0 && students.every((s) => s.nome === "---" || !s.nome);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-xl my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          <div>
            <h4 className="text-xl font-bold text-[#0E284E] font-serif">{mobility.universidade}</h4>
            <p className="text-xs text-gray-500 font-sans mt-0.5">{mobility.pais} | {mobility.ano}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-[#F8FAFC]">
              <p className="text-xs text-gray-500 font-medium">Estudantes enviados</p>
              <p className="text-2xl font-bold text-[#0E284E] mt-1">{mobility.enviados}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-[#F8FAFC]">
              <p className="text-xs text-gray-500 font-medium">Estudantes recebidos</p>
              <p className="text-2xl font-bold text-[#0E284E] mt-1">{mobility.recebidos}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-[#F8FAFC]">
              <p className="text-xs text-gray-500 font-medium">Total</p>
              <p className="text-2xl font-bold text-[#0E284E] mt-1">{mobility.total}</p>
            </div>
          </div>

          {isRedacted && (
            <div className="p-3 border border-gray-300 text-[#0E284E] rounded-md text-xs font-medium">
              <span className="italic">Os dados pessoais dos estudantes (Nome, Email e Matrícula) estão ocultos para registos de outras universidades por razões de privacidade.</span>
            </div>
          )}

          <div className="space-y-3">
            <h5 className="font-semibold text-base text-[#0E284E]">
              Estudantes na Mobilidade ({students.length})
            </h5>

            {students.length === 0 ? (
              <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
                Nenhum dado detalhado foi importado para esta mobilidade.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[50vh] overflow-y-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-[#F3F6F8] text-[#404c4e] sticky top-0 font-medium">
                    <tr>
                      <th className="p-2.5">MATRÍCULA</th>
                      <th className="p-2.5">NOME</th>
                      <th className="p-2.5">EMAIL</th>
                      <th className="p-2.5">TIPO</th>
                      <th className="p-2.5">ORIGEM</th>
                      <th className="p-2.5">DESTINO</th>
                      <th className="p-2.5">CURSO ORIGEM</th>
                      <th className="p-2.5">CURSO DESTINO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={`${student.matricula}-${index}`}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-2.5 font-mono text-gray-700">
                          {student.matricula || "-"}
                        </td>
                        <td className="p-2.5 font-medium text-gray-800">
                          {student.nome || "-"}
                        </td>
                        <td className="p-2.5 text-gray-600">
                          {student.email || "-"}
                        </td>
                        <td className="p-2.5 text-gray-700 font-medium">
                          {student.tipoMobilidade || "-"}
                        </td>
                        <td className="p-2.5 text-gray-600">
                          <div>{student.paisOrigem || "-"}</div>
                          {student.universidadeOrigem && (
                            <div className="text-xs text-gray-400">{student.universidadeOrigem}</div>
                          )}
                        </td>
                        <td className="p-2.5 text-gray-600">
                          <div>{student.paisDestino || "-"}</div>
                          {student.universidadeDestino && (
                            <div className="text-xs text-gray-400">{student.universidadeDestino}</div>
                          )}
                        </td>
                        <td className="p-2.5 text-gray-600 truncate max-w-[120px]" title={student.cursoOrigem}>
                          {student.cursoOrigem || "-"}
                        </td>
                        <td className="p-2.5 text-gray-600 truncate max-w-[120px]" title={student.cursoDestino}>
                          {student.cursoDestino || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer font-medium"
          >
            Concluir / Fechar
          </button>
        </div>
      </div>
    </div>
  );
}