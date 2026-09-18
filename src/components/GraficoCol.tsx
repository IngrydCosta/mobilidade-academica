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

export type GraficoPaisDataPoint = {
  pais: string;
  enviados: number;
  recebidos: number;
  total?: number;
};

type DashboardData = {
  graficoPaises?: GraficoPaisDataPoint[];
};

type GraficoColProps = {
  dashboardData: DashboardData | null;
};

function GraficoCol({ dashboardData }: GraficoColProps) {
  const data = dashboardData?.graficoPaises || [];

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
            dataKey="pais"
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