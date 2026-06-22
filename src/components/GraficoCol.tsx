import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

type GraficoDataPoint = {
  ano: string;
  enviados: number;
  recebidos: number;
};

type DashboardData = {
  grafico: GraficoDataPoint[];
};

type GraficoColProps = {
  dashboardData: DashboardData | null;
};

function GraficoCol({ dashboardData }: GraficoColProps) {
  // Filtra ano "0" e ordena por ano
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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          <XAxis
            dataKey="ano"
            tick={{ fill: "#404c4e" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#404c4e" }}
            tickLine={false}
          />

          <Tooltip />
          <Legend />

          <Bar
            dataKey="enviados"
            fill="#173764"
            radius={[6, 6, 0, 0]}
            name="Estudantes Enviados"
          />

          <Bar
            dataKey="recebidos"
            fill="#D9A95E"
            radius={[6, 6, 0, 0]}
            name="Estudantes Recebidos"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoCol;