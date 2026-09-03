import { IoClose } from "react-icons/io5";

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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4 bg-[#0E284E] text-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">{mobility.universidade}</h2>
            <p className="text-sm text-gray-200">
              {mobility.pais} | {mobility.ano}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <IoClose size={24} />
          </button>
        </div>

  <div className="p-6 overflow-auto max-h-[70vh]">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Estudantes enviados
              </p>

              <p className="text-2xl font-bold text-[#0E284E]">
                {mobility.enviados}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Estudantes recebidos
              </p>

              <p className="text-2xl font-bold text-[#0E284E]">
                {mobility.recebidos}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="text-2xl font-bold text-[#0E284E]">
                {mobility.total}
              </p>
            </div>
          </div>

        {students.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
              Nenhum dado detalhado foi importado para esta mobilidade.
            </p>
             </div>
          ) : (
             <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-100 text-left">
                  <th className="p-3">Matrícula</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Origem</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">Curso Origem</th>
                  <th className="p-3">Curso Destino</th>
                </tr>
              </thead>

              <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={`${student.matricula}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        {student.matricula || "-"}
                      </td>

                      <td className="p-3">
                        {student.nome || "-"}
                      </td>

                      <td className="p-3">
                        {student.email || "-"}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            (student.tipoMobilidade || "").toUpperCase() === "RECEBIDO"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {student.tipoMobilidade || "ENVIADO"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div>{student.paisOrigem || "-"}</div>
                        {student.universidadeOrigem && (
                          <div className="text-xs text-gray-500">{student.universidadeOrigem}</div>
                        )}
                      </td>

                      <td className="p-3">
                        <div>{student.paisDestino || "-"}</div>
                        {student.universidadeDestino && (
                          <div className="text-xs text-gray-500">{student.universidadeDestino}</div>
                        )}
                      </td>

                      <td className="p-3">
                        {student.cursoOrigem || "-"}
                      </td>

                      <td className="p-3">
                        {student.cursoDestino || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}