import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type GraficoDataPoint = {
  ano: string;
  enviados: number;
  recebidos: number;
};

type DashboardData = {
  cards: {
    total: number;
    enviados: number;
    recebidos: number;
    anoTop: number;
  };
  grafico: GraficoDataPoint[];
  indicators?: {
    universidades: number;
    totalRegistros: number;
  };
};

type GraficoRowProps = {
  dashboardData: DashboardData | null;
};

function GraficoRow({ dashboardData }: GraficoRowProps) {
  const rawData = dashboardData?.grafico || [];

  const data = rawData
    .filter((item) => item.ano !== "0" && item.ano !== null)
    .sort((a, b) => Number(a.ano) - Number(b.ano));

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl h-80 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Nenhum dado disponível para o gráfico.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="ano" 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="enviados"
            stroke="#173764"
            strokeWidth={3}
            name="Estudantes Enviados"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="recebidos"
            stroke="#D9A95E"
            strokeWidth={3}
            name="Estudantes Recebidos"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoRow;